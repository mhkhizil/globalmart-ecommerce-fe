type InputProps = React.SVGAttributes<SVGAElement> & {
  timerFillerColor?: string;
  tickStrokeColor?: string;
};

function TimerIcon(props: InputProps) {
  const { tickStrokeColor, timerFillerColor, className } = props;
  return (
    <>
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill={timerFillerColor ?? 'none'}
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M9 5.66667V9L11.5 11.5M16.5 9C16.5 13.1421 13.1421 16.5 9 16.5C4.85786 16.5 1.5 13.1421 1.5 9C1.5 4.85786 4.85786 1.5 9 1.5C13.1421 1.5 16.5 4.85786 16.5 9Z"
          stroke={tickStrokeColor ?? '#878787'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
}
export default TimerIcon;
