import { AiOutlineStock } from 'react-icons/ai';
import { GoStack } from 'react-icons/go';
import { HiOutlineDocumentDuplicate } from 'react-icons/hi';
import { IoMdInformationCircleOutline } from 'react-icons/io';


export const navigation = [
  {
    id: "0",
    title: "Trading",
    url: "/",
    icon: <AiOutlineStock size={16}/>
  },
  {
    id: "2",
    title: "Stacking",
    url: "/stacking",
    icon: <GoStack size={16}/>,
  },
  {
    id: "1",
    title: "White Paper",
    url: "/white_paper",
    icon: <HiOutlineDocumentDuplicate size={16}/>,
  },
  {
    id: "3",
    title: "About",
    url: "/about",
    icon: <IoMdInformationCircleOutline size={16}/>,
  },
];


export const socials = [
  {
    id: "0",
    title: "Discord",
    iconUrl: "/discord.svg",
    url: "https://discord.com/invite/HNhfAugqjb",
  },
  {
    id: "1",
    title: "Twitter",
    iconUrl:  "/twitter.svg",
    url: "#",
  },
  {
    id: "2",
    title: "GitHub",
    iconUrl:  "/github.svg",
    url: "https://github.com/builders-academy",
  },
  {
    id: "3",
    title: "Telegram",
    iconUrl:  "/telegram.svg",
    url: "https://t.me/+CzSrLytJb0JjZWQ9",
  },
  {
    id: "4",
    title: "Facebook",
    iconUrl:  "/facebook.svg",
    url: "https://www.facebook.com/people/Builders-Academy/61557169582718/",
  },
];
