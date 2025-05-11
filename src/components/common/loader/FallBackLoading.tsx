import Loader from './Loader';

function FallBackLoading() {
  return (
    <div className="flex fixed w-full items-center justify-center inset-0 bg-white bg-opacity-20">
      <div className="fallback-loader"></div>
    </div>
  );
}
export default FallBackLoading;
