import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../../components/common/FormInput";
import CustomButton from "../../components/common/Button";
import { BsSearch } from "react-icons/bs";

const searchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
});

const HomeHero = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(searchSchema),
  });

  const onSubmit = (data) => {
    console.log("Search:", data); // Replace with search logic later
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative overflow-hidden min-h-[700px] h-[92vh]  text-black"
    >
      <LazyLoadImage
        src="https://media.istockphoto.com/id/1170478532/photo/the-house-wall-gets-new-color.jpg?s=612x612&w=0&k=20&c=i-5uV_K3aOMnVDqYR-s0Wy-FmhVipwtrzSeovDw0IKY="
        alt="Home services background"
        className="w-full h-full object-cover opacity-30"
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center font-playfair w-full max-w-4xl px-4">
        <h1 className="text-4xl md:text-6xl font-bold flex flex-wrap justify-center items-center gap-2 mb-4">
          Find Trusted
          <span className="hero-span">Ace</span>
          Near You
        </h1>
        <h3 className="text-lg md:text-xl text-gray-400 font-inter font-normal mt-5">
          Connect with qualified professionals for all your home service needs
        </h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-14 flex justify-center"
        >
          <div className="relative flex items-center max-w-xl w-full h-[50px]">
            <BsSearch className="absolute z-10 text-lg left-4 text-gray-300" />
            <FormInput
              type="text"
              placeholder="Search here..."
              {...register("query")}
              error={errors.query?.message}
              className="flex-1 h-full text-base rounded-tl-[25px] rounded-bl-[25px] focus:border-primary focus:ring-0 focus:shadow-[0_0_20px_rgba(45,90,69,0.3)]"
              inputClassName="pl-10 rounded-tr-none rounded-br-none"
              aria-label="Search for home services"
              aria-describedby="search-button"
              autoFocus
            />
            <CustomButton
              type="submit"
              text="Search"
              background="#2D5A45"
              color="white"
              width={"50px"}
              customClass=" h-full text-base rounded-[25px] rounded-tl-none rounded-bl-none"
              id="search-button"
            />
          </div>
        </form>
      </div>
    </motion.section>
  );
};

export default HomeHero;
