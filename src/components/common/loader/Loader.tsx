import { CSSProperties } from 'react';
import ScaleLoader from 'react-spinners/ScaleLoader';

const override: CSSProperties = {
  display: 'block',
  margin: '0 auto',
  padding: '0 0 0 0px',
  height: '18px',
};

interface Inputprops {
  color?: string;
}

function Loader(props: Inputprops) {
  return (
    <>
      {' '}
      <ScaleLoader
        color={props.color ?? 'white'}
        loading
        cssOverride={override}
        aria-label="Loading Spinner"
        data-testid="loader"
        height={13}
      />
    </>
  );
}
export default Loader;
