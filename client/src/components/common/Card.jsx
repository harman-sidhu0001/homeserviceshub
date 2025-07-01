import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Button from "./Button";
import { Link } from "react-router-dom";
import CustomButton from "./Button";

const Card = ({ title, description, image, action, className = "" }) => (
  <motion.article
    className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}
    whileHover={{ scale: 1.03 }}
    transition={{ duration: 0.2 }}
    role="region"
    aria-labelledby={`${title}-title`}
  >
    {image && (
      <LazyLoadImage
        src={image}
        alt={title}
        className="w-full h-48 object-cover"
        wrapperClassName="w-full h-48"
        placeholderSrc="/assets/images/placeholder.png"
      />
    )}
    <div className="p-4">
      <h3
        id={`${title}-title`}
        className="text-xl font-semibold text-primary mb-2"
      >
        {title}
      </h3>
      <p className="text-accent mb-4">{description}</p>
      {action && (
        <Link to={action.href} className="inline-block">
          <CustomButton text={action.children} />
        </Link>
      )}
    </div>
  </motion.article>
);

export default Card;
