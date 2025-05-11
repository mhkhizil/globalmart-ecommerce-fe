import { CSSProperties } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';

const override: CSSProperties = {
  display: 'block',
  margin: '0 auto',
  padding: '0 0 0 0px',
  height: '18px',
};

interface Inputprops {
  color?: string;
  size?: number;
}

function ProductScrollLoader(props: Inputprops) {
  return (
    <>
      {' '}
      <BeatLoader
        color={props.color ?? 'white'}
        loading
        cssOverride={override}
        aria-label="Loading Spinner"
        data-testid="loader"
        size={props.size ?? 10}
      />
    </>
  );
}
export default ProductScrollLoader;
