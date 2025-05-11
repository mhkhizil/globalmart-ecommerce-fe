type InputProps = React.SVGAttributes<SVGAElement> & {
  circleBorderColor?: string;
  circleFillerColor?: string;
  heartStrokeColor?: string;
  heartFillColor?: string;
  isLiked: boolean;
};

function LikeIcon(props: InputProps) {
  const {
    circleBorderColor,
    isLiked,
    heartStrokeColor,
    circleFillerColor,
    className,
    heartFillColor,
  } = props;
  return (
    <>
      <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <rect
          width="30"
          height="30"
          rx="15"
          fill={isLiked ? 'white' : (circleFillerColor ?? 'white')}
          stroke={circleBorderColor ?? 'white'}
        />
        <path
          d="M8.59835 10.2649C7.13388 11.7293 7.13388 14.1037 8.59835 15.5682L15 21.9698L21.4017 15.5682C22.8661 14.1037 22.8661 11.7293 21.4016 10.2649C19.9372 8.80039 17.5628 8.80039 16.0983 10.2649L15 11.3632L13.9017 10.2649C12.4372 8.80039 10.0628 8.80039 8.59835 10.2649Z"
          stroke={heartStrokeColor ?? '#F14141'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={isLiked ? '#F14141' : (heartFillColor ?? 'white')}
        />
      </svg>
    </>
  );
}
export default LikeIcon;
