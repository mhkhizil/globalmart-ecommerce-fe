import clsx from 'clsx';

type InputProps = React.SVGAttributes<SVGAElement> & {
  circleBorderColor?: string;
  arrowStrokeColor?: string;
};

function BackIcon(props: InputProps) {
  const { className, circleBorderColor, arrowStrokeColor } = props;
  return (
    <>
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={clsx('bg-transparent stroke-white', className)}
      >
        <rect
          x="0.5"
          y="0.5"
          width="35"
          height="35"
          rx="17.5"
          stroke={circleBorderColor ?? '#EDEDED'}
        />
        <path
          d="M20.5 23.8334L14.6667 18.0001L20.5 12.1667"
          stroke={arrowStrokeColor ?? '#101010'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
}
export default BackIcon;
