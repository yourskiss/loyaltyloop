import { useTimer } from 'react-timer-hook';
function Otpcountdown({ expiryTimestamp, onSuccess }) {
  const {seconds} = useTimer({ expiryTimestamp, onExpire: () => onSuccess(true) });
  return (<b>{seconds}</b>);
}
export default Otpcountdown;