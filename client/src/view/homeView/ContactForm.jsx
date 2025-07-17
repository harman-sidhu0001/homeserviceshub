import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../../components/common/FormInput";
import CustomButton from "../../components/common/Button";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data) => {
    reset();
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative py-28 px-4 bg-gradient-to-br from-white/30 via-white/10 to-white/30 backdrop-blur-2xl overflow-hidden"
    >
      {/* Optional decorative blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-80 h-80 bg-primary/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-[-20px] right-[-50px] w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-bold text-black mb-3 drop-shadow-md">
          Get in Touch
        </h2>
        <p className="text-lg text-accent mb-10">
          We’d love to hear from you. Let’s talk about your goals.
        </p>

        {/* Glassy form card with shadow and primary/60 bg */}
        <div className="bg-primary/10 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.2)] border border-white/10">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 text-left"
          >
            <FormInput
              type="text"
              placeholder="Your Name"
              {...register("name")}
              error={errors.name?.message}
              inputClassName="text-lg px-5 py-3 bg-white/70 backdrop-blur-sm placeholder-primary/70 focus:shadow-md"
            />
            <FormInput
              type="email"
              placeholder="Your Email"
              {...register("email")}
              error={errors.email?.message}
              inputClassName="text-lg px-5 py-3 bg-white/70 backdrop-blur-sm placeholder-primary/70 focus:shadow-md"
            />
            <FormInput
              as="textarea"
              placeholder="Your Message"
              {...register("message")}
              error={errors.message?.message}
              className="h-36"
              inputClassName="text-lg px-5 py-3 bg-white/70 backdrop-blur-sm placeholder-primary/70 focus:shadow-md"
            />
            <CustomButton
              text="Send Message"
              className="w-full text-lg py-3 bg-white text-primary font-bold rounded-xl shadow-md hover:bg-white/90 transition duration-300"
            />
          </form>
        </div>
      </div>
    </motion.section>
  );
};

export default ContactForm;
