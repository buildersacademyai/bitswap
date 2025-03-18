
import Section from "./Section";
import { socials } from "../constants";

const Footer = () => {
  return (
    <Section crosses className=" !py-10 px-12 bg-gray-800">
      <div className="container flex sm:justify-between justify-center items-center gap-10 max-sm:flex-col">
        <p className="caption text-n-4 lg:block text-gray-300">
          ©&nbsp;{new Date().getFullYear()}. All rights reserved
        </p>
        <ul className="flex gap-5 flex-wrap ">
          {socials.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              className="flex items-center justify-center w-10 h-10 bg-n-7 rounded-full transition-colors hover:bg-n-6 border hover:bg-gray-600 border-gray-800"
            >
              <img src={item.iconUrl} width={16} height={16} alt={item.title} />
            </a>
          ))}
        </ul>
      </div>
    </Section>
  );
};

export default Footer;
