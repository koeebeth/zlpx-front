import isEmpty from "lodash/isEmpty";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { SubmitHandler } from "react-hook-form";

import TelegramIcon from "../../../assets/telegram.svg?react";
import VkIcon from "../../../assets/vk.svg?react";
import { UserProfile } from "../../../types";

type PropsT = {
  user: UserProfile;
  onSubmit: (user: UserProfile) => void;
};

type ContactFormFields = Pick<
  UserProfile,
  "full_name" | "telegram_nickname" | "vk_nickname" | "phone_number"
>;

const inputClasses =
  "border-1 border-zinc-700 rounded-sm px-1 outline-0 m-0 block flex-1";
const inputClassesError =
  "border-1 border-red-900 rounded-sm px-1 outline-0 m-0 block flex-1";

export const ContactForm: FC<PropsT> = ({ user, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register: registerContact,
    formState: { errors },
    handleSubmit,
  } = useForm<ContactFormFields>({
    mode: "onChange",
    defaultValues: user,
  });

  const onContactSubmit: SubmitHandler<ContactFormFields> = async (data) => {
    setIsSubmitting(true);
    try {
      await onSubmit({ ...user, ...data });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="animate-fadein">
        <form onSubmit={handleSubmit(onContactSubmit)}>
          <h3 className="font-semibold text-lg mb-4 dark:text-zinc-200">
            <input
              type="text"
              className={errors.full_name ? inputClassesError : inputClasses}
              {...registerContact("full_name", { required: true })}
            />
          </h3>
          <h4 className="text-sm dark:text-zinc-400 mb-3 flex gap-2 items-center">
            <VkIcon />
            <input
              type="text"
              className={errors.vk_nickname ? inputClassesError : inputClasses}
              {...registerContact("vk_nickname", { required: true })}
            />
          </h4>
          <h4 className="text-sm dark:text-zinc-400 mb-3 flex gap-2 items-center">
            <TelegramIcon />
            <input
              type="text"
              className={
                errors.telegram_nickname ? inputClassesError : inputClasses
              }
              {...registerContact("telegram_nickname", { required: true })}
            />
          </h4>
          <h4 className="text-sm dark:text-zinc-400 flex gap-2 items-center">
            <span className="material-icons md-20">phone</span>
            <input
              type="text"
              className={errors.phone_number ? inputClassesError : inputClasses}
              {...registerContact("phone_number", { required: true, pattern: /(\+(\d|\d\s){11})|((\d|\d\s){11})/})}
            />
          </h4>
        <button 
          className="absolute bottom-2 right-2" 
          type="submit"
          disabled={isSubmitting || !isEmpty(errors)}
        >
          <span
            className={`material-symbols-outlined ${
              isSubmitting 
                ? "text-zinc-600 animate-spin" 
                : !isEmpty(errors) 
                  ? "text-zinc-600" 
                  : "text-light-purple"
            }`}
          >
            {isSubmitting ? "sync" : "check"}
          </span>
        </button>
        </form>
      </div>
    </>
  );
};
