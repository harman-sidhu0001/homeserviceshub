// // components/shared/SVGIcon.jsx
// import React, { useMemo } from "react";
// import PropTypes from "prop-types";

// const SVGIcon = ({ name, size = 24, className, ...props }) => {
//   const iconPath = useMemo(() => {
//     return `${process.env.PUBLIC_URL}/assets/svgs/${name}.svg`;
//   }, [name]);

//   return (
//     <img
//       src={iconPath}
//       width={size}
//       height={size}
//       className={`svg-icon ${className}`}
//       alt={`${name} icon`}
//       loading="lazy"
//       {...props}
//     />
//   );
// };

// // Prop types for error prevention
// SVGIcon.propTypes = {
//   name: PropTypes.string.isRequired,
//   size: PropTypes.number,
//   className: PropTypes.string,
// };

// export default React.memo(SVGIcon);
