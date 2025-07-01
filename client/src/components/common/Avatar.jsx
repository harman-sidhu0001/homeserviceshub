const Avatar = ({ src, alt, className = "" }) => (
  <img
    src={src || "/assets/images/placeholder.png"}
    alt={alt}
    className={`rounded-full w-10 h-10 ${className}`}
  />
);

export default Avatar;
