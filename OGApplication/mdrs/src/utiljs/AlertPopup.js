/* Alert functionality referenced from Jeffrey Yu
Confirm with Zac whether previous errors replacement is suitable
and whether timeline allows CB
*/
import { Alert } from '@mui/material';
import useAlert from './UseAlert';

const AlertPopup = () => {
  const { text, type } = useAlert();

  // type options are success, info, warning, error
  if (text && type) {
    return (
      <Alert
        severity={type}
        sx={{
          position: 'absolute',
          zIndex: 10,
        }}
      >
        {text}
      </Alert>
    );
  } else {
    return <></>;
  }
};

export default AlertPopup;