;; ====================================================
;; AMM Blueprint with Traits, AntiRug Pull, and Extended Data Tracking
;; ====================================================

;; Define the AMM Trait interface that external contracts or users can expect.


;; Import token traits to ensure proper token handling

(use-trait ft-trait 'ST1NXBK3K5YYMD6FD41MVNP3JS1GABZ8TRVX023PT.sip-010-trait-ft-standard.sip-010-trait)
;; (use-trait amm-trait .amm-trait)


;; ====================================================
;; Constants & Error Definitions
;; ====================================================
(define-constant FEE_NUMERATOR u997)         ;; For a 0.3% fee: 997/1000
(define-constant FEE_DENOMINATOR u1000)
(define-constant LIQUIDITY_LOCK_PERIOD u100)   ;; Liquidity lock period (in block-height units)
(define-constant MINIMUM_LIQUIDITY u1000)     ;; Minimum liquidity to prevent precision attacks
(define-constant CONTRACT_OWNER tx-sender)    ;; Set contract owner at deploy time

;; Improved error codes with descriptive names
(define-constant ERR_INSUFFICIENT_OUTPUT (err u100))
(define-constant ERR_INSUFFICIENT_LIQUIDITY (err u101))
(define-constant ERR_INVALID_AMOUNT (err u102))
(define-constant ERR_DEADLINE_EXPIRED (err u103))
(define-constant ERR_NO_RESERVE (err u104))
(define-constant ERR_LIQUIDITY_LOCKED (err u105))
(define-constant ERR_SLIPPAGE_EXCEEDED (err u106))
(define-constant ERR_UNAUTHORIZED (err u107))
(define-constant ERR_ZERO_ADDRESS (err u108))
(define-constant ERR_INSUFFICIENT_TOKEN_BALANCE (err u109))
(define-constant ERR_OVERFLOW (err u110))
(define-constant ERR_TRANSFER_FAILED (err u111))
(define-constant ERR_NOT_ACTIVE (err u112))

;; ====================================================
;; Data Variables
;; ====================================================
(define-data-var reserve-a uint u0)
(define-data-var reserve-b uint u0)
(define-data-var total-liquidity uint u0)

;; Track each provider's liquidity balance.
(define-map provider-liquidity principal uint)
;; Record the block height when a provider last added liquidity.
(define-map liquidity-lock principal uint)

(define-map pool { token-a: principal, token-b: principal } { total-amount: uint, token-a: uint, token-b: uint})

;; Extended operational metrics:
(define-data-var total-swap-count uint u0)
(define-data-var total-swap-volume-a uint u0)
(define-data-var total-swap-volume-b uint u0)
(define-data-var last-swap-block uint u0)
(define-data-var pool-active bool true)  ;; Enable emergency stop

;; ====================================================
;; Private Helper Functions
;; ====================================================

;; Verify caller is contract owner
(define-private (is-contract-owner)
  (is-eq tx-sender CONTRACT_OWNER))

;; Emergency toggle for pool activity
(define-public (toggle-pool-active)
  (begin
    (asserts! (is-contract-owner) ERR_UNAUTHORIZED)
    (ok (var-set pool-active (not (var-get pool-active))))))

;; Check pool is active
(define-private (assert-pool-active)
  (if (var-get pool-active)
      true
      false))  ;; New error code for inactive pool

;; Calculate the output amount using the constant product formula with fee.
(define-private (calc-output (amount-in uint) (reserve-in uint) (reserve-out uint))
  (let ((amount-in-with-fee (/ (* amount-in FEE_NUMERATOR) FEE_DENOMINATOR)))
    (/ (* amount-in-with-fee reserve-out)
       (+ reserve-in amount-in-with-fee))))

;; Check that the current block-height is within the deadline.
(define-private (check-deadline (deadline uint))
  (<= block-height deadline))

;; Transfer tokens using ft-transfer trait - returns true on success
(define-private (transfer-token (token-contract <ft-trait>) (amount uint) (sender principal) (recipient principal))
  (let ((transfer-result (contract-call? token-contract transfer amount sender recipient none)))
    (is-ok transfer-result))) 

;; Validate basic inputs and reserves
(define-private (validate-swap-inputs (amount-in uint))
  (and (> amount-in u0)
       (> (var-get reserve-a) u0)
       (> (var-get reserve-b) u0)))

(define-private (min (a uint) (b uint))
  (if (< a b) a b))




;; Square root integer implementation for liquidity calculation
;; (define-private (sqrti (n uint))
;;   (let ((x (/ (+ n u1) u2)))
;;     (sqrti-iter x n)))

;; Define a private helper function for square root calculation
;; (define-private (sqrti-helper (n uint) (x uint))
;;   (let ((y (/ (+ x (/ n x)) u2)))
;;     (if (>= x y)
;;         x
;;         (sqrti n y))))

;; (define-private (sqrti-init (n uint))
;;   (sqrti n (/ (+ n u1) u2)))


;; Calculate the optimal liquidity tokens based on the token amounts
(define-private (calculate-liquidity-tokens (amount-a uint) (amount-b uint))
  (let (
        (current-reserve-a (var-get reserve-a))
        (current-reserve-b (var-get reserve-b))
        (current-liquidity (var-get total-liquidity))
       )
    (if (is-eq current-liquidity u0)
        ;; First liquidity provision - use geometric mean of amounts
        (sqrti (* amount-a amount-b))
        ;; Subsequent provisions - proportional to existing reserves
        (min 
          (/ (* amount-a current-liquidity) current-reserve-a)
          (/ (* amount-b current-liquidity) current-reserve-b)))))


;; (define-private (sqrti-iter (x uint) (n uint))
;;   (let ((y (/ (+ x (/ n x)) u2)))
;;     (if (>= x y)
;;         x
;;         (sqrti-iter y n))))



;; ====================================================
;; Public Functions AMM Trait Implementation
;; ====================================================

;; 1. Add Liquidity with a Liquidity Lock to Deter Rug Pulls.
(define-public (add-liquidity (token-a-contract <ft-trait>) (token-b-contract <ft-trait>) (amount-a uint) (amount-b uint) (deadline uint))
  (begin
    (asserts! (assert-pool-active) (err u112))
    (asserts! (check-deadline deadline) ERR_DEADLINE_EXPIRED)
    (asserts! (and (> amount-a u0) (> amount-b u0)) ERR_INVALID_AMOUNT)
    
    (let (
          (current-reserve-a (var-get reserve-a))
          (current-reserve-b (var-get reserve-b))
          (current-liquidity (var-get total-liquidity))
          ;; (token-a-contract  (var-get token-a))
          ;; (token-b-contract  (var-get token-b))
         )
      
      ;; Calculate liquidity tokens to mint
      (let ((minted-liquidity 
            (if (is-eq current-liquidity u0)
                ;; First liquidity provision
                (- (sqrti (* amount-a amount-b)) MINIMUM_LIQUIDITY)
                ;; Subsequent provisions - proportional to existing reserves
                (min 
                  (/ (* amount-a current-liquidity) current-reserve-a)
                  (/ (* amount-b current-liquidity) current-reserve-b)))))
        
        ;; Transfer tokens to the contract
        (asserts! (transfer-token token-a-contract amount-a tx-sender (as-contract tx-sender)) ERR_TRANSFER_FAILED)
        (asserts! (transfer-token token-b-contract amount-b tx-sender (as-contract tx-sender)) ERR_TRANSFER_FAILED)
        
        ;; Update global reserves and total liquidity
        (var-set reserve-a (+ current-reserve-a amount-a))
        (var-set reserve-b (+ current-reserve-b amount-b))
        (var-set total-liquidity (+ current-liquidity minted-liquidity))
        
        ;; Update the provider's balance and record the deposit block-height
        (map-set provider-liquidity tx-sender 
                (+ (default-to u0 (map-get? provider-liquidity tx-sender)) minted-liquidity))
        (map-set liquidity-lock tx-sender block-height)
        
        (ok minted-liquidity)))))


;; 2. Remove Liquidity Can Only Withdraw After the Liquidity Lock Period.
(define-public (remove-liquidity (token-a-contract <ft-trait>) (token-b-contract <ft-trait>) (liquidity uint) (deadline uint))
  (begin
    (asserts! (assert-pool-active) (err u112))
    (asserts! (check-deadline deadline) ERR_DEADLINE_EXPIRED)
    (asserts! (> liquidity u0) ERR_INVALID_AMOUNT)
    
    (let (
          (current-liquidity (var-get total-liquidity))
          (provider-liq (default-to u0 (map-get? provider-liquidity tx-sender)))
          (lock-time (default-to u0 (map-get? liquidity-lock tx-sender)))
          ;; (token-a-contract (unwrap-panic (var-get token-a)))
          ;; (token-b-contract (unwrap-panic (var-get token-b)))
         )
      
      (asserts! (>= provider-liq liquidity) ERR_INSUFFICIENT_LIQUIDITY)
      (asserts! (>= block-height (+ lock-time LIQUIDITY_LOCK_PERIOD)) ERR_LIQUIDITY_LOCKED)
      
      (let (
            (amount-a-out (/ (* (var-get reserve-a) liquidity) current-liquidity))
            (amount-b-out (/ (* (var-get reserve-b) liquidity) current-liquidity))
           )
        
        ;; Transfer tokens from contract to user
        (asserts! (transfer-token token-a-contract amount-a-out (as-contract tx-sender) tx-sender) ERR_TRANSFER_FAILED)
        (asserts! (transfer-token token-b-contract amount-b-out (as-contract tx-sender) tx-sender) ERR_TRANSFER_FAILED)
        
        ;; Update global reserves and total liquidity
        (var-set reserve-a (- (var-get reserve-a) amount-a-out))
        (var-set reserve-b (- (var-get reserve-b) amount-b-out))
        (var-set total-liquidity (- current-liquidity liquidity))
        
        ;; Update the provider's liquidity balance
        (map-set provider-liquidity tx-sender (- provider-liq liquidity))
        
        (ok (tuple (amount-a amount-a-out) (amount-b amount-b-out)))))))

;; 3. Swap Token A for Token B with Deadline and Minimum Output Protection.
(define-public (swap-a-to-b (token-a-contract <ft-trait>) (token-b-contract <ft-trait>) (amount-in uint) (min-out uint) (deadline uint))
  (begin
    (asserts! (assert-pool-active) (err u112))
    (asserts! (check-deadline deadline) ERR_DEADLINE_EXPIRED)
    (asserts! (validate-swap-inputs amount-in) ERR_INVALID_AMOUNT)
    
    (let (
          (current-reserve-a (var-get reserve-a))
          (current-reserve-b (var-get reserve-b))
          ;; (token-a-contract (unwrap-panic (var-get token-a)))
          ;; (token-b-contract (unwrap-panic (var-get token-b)))
         )
      
      (let ((amount-out (calc-output amount-in current-reserve-a current-reserve-b)))
        (asserts! (>= amount-out min-out) ERR_INSUFFICIENT_OUTPUT)
        (asserts! (< amount-out current-reserve-b) ERR_INSUFFICIENT_LIQUIDITY)
        
        ;; Transfer token A from user to contract
        (asserts! (transfer-token token-a-contract amount-in tx-sender (as-contract tx-sender)) ERR_TRANSFER_FAILED)
        
        ;; Transfer token B from contract to user
        (asserts! (transfer-token token-b-contract amount-out (as-contract tx-sender) tx-sender) ERR_TRANSFER_FAILED)
        
        ;; Update reserves
        (var-set reserve-a (+ current-reserve-a amount-in))
        (var-set reserve-b (- current-reserve-b amount-out))
        
        ;; Update extended swap metrics
        (var-set total-swap-count (+ (var-get total-swap-count) u1))
        (var-set total-swap-volume-a (+ (var-get total-swap-volume-a) amount-in))
        (var-set total-swap-volume-b (+ (var-get total-swap-volume-b) amount-out))
        (var-set last-swap-block block-height)
        
        (ok amount-out)))))

;; 4. Swap Token B for Token A with Deadline and Minimum Output Protection.
(define-public (swap-b-to-a (token-a-contract <ft-trait>) (token-b-contract <ft-trait>) (amount-in uint) (min-out uint) (deadline uint))
  (begin
    (asserts! (assert-pool-active) (err u112))
    (asserts! (check-deadline deadline) ERR_DEADLINE_EXPIRED)
    (asserts! (validate-swap-inputs amount-in) ERR_INVALID_AMOUNT)
    
    (let (
          (current-reserve-a (var-get reserve-a))
          (current-reserve-b (var-get reserve-b))
          ;; (token-b-contract (unwrap-panic (var-get token-b)))
          ;; (token-a-contract (unwrap-panic (var-get token-a)))
         )
      
      (let ((amount-out (calc-output amount-in current-reserve-b current-reserve-a)))
        (asserts! (>= amount-out min-out) ERR_INSUFFICIENT_OUTPUT)
        (asserts! (< amount-out current-reserve-a) ERR_INSUFFICIENT_LIQUIDITY)
        
        ;; Transfer token B from user to contract
        (asserts! (transfer-token token-b-contract amount-in tx-sender (as-contract tx-sender)) ERR_TRANSFER_FAILED)
        
        ;; Transfer token A from contract to user
        (asserts! (transfer-token token-a-contract amount-out (as-contract tx-sender) tx-sender) ERR_TRANSFER_FAILED)
        
        ;; Update reserves
        (var-set reserve-b (+ current-reserve-b amount-in))
        (var-set reserve-a (- current-reserve-a amount-out))
        
        ;; Update extended swap metrics
        (var-set total-swap-count (+ (var-get total-swap-count) u1))
        (var-set total-swap-volume-b (+ (var-get total-swap-volume-b) amount-in))
        (var-set total-swap-volume-a (+ (var-get total-swap-volume-a) amount-out))
        (var-set last-swap-block block-height)
        
        (ok amount-out)))))

