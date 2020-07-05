import CopyToClipboard from 'react-copy-to-clipboard';
import React, {useState, useEffect} from 'react';
import QRCode from 'qrcode.react';
import tw, {styled} from 'twin.macro';

import {useRequestStatus} from '../contexts/request-status-context';
import {removeProtocol} from '../util/link';
import Icon from '../components/Icon';

export type ProcessedRequestProperties = {
  error: boolean | null;
  message: string;
};

const StyledH1 = styled.h1`
  border-bottom: 1px dotted ${({theme}): string => theme.statsTotalUnderline};
  font-size: 1.602em;
  padding-bottom: 2px;
  color: rgb(41, 71, 86);

  ${tw`hover:opacity-75 min-w-0 m-0 font-light cursor-pointer`}
`;

const StyledPopupBody = styled.div`
  ${tw`flex justify-center px-4 pt-4 pb-0`}

  .copy__icon,
  .check__icon {
    svg {
      stroke: rgb(101, 189, 137);
      stroke-width: 2.5;
    }
  }

  .qr__icon {
    svg {
      fill: rgb(89, 89, 89);
      stroke: none;
    }
  }
`;

const ResponseBody: React.FC = () => {
  const {error, message} = useRequestStatus()[0];
  const [copied, setCopied] = useState<boolean>(false);
  const [QRView, setQRView] = useState<boolean>(false);

  // reset copy message
  useEffect(() => {
    setTimeout(() => {
      setCopied(false);
    }, 1300);
  }, [copied]);

  return (
    <>
      <StyledPopupBody>
        {!error ? (
          <>
            <Icon
              tw="my-0 ml-0 mr-2"
              className="icon qr__icon"
              name="qrcode"
              onClick={(): void => {
                return setQRView(!QRView);
              }}
            />
            {!copied ? (
              <CopyToClipboard
                text={message}
                onCopy={(): void => {
                  return setCopied(true);
                }}
              >
                <Icon
                  tw="my-0 ml-0 mr-4"
                  className="icon copy__icon"
                  name="copy"
                />
              </CopyToClipboard>
            ) : (
              <Icon
                tw="my-0 ml-0 mr-4"
                className="icon check__icon"
                name="tick"
              />
            )}
            <CopyToClipboard
              text={message}
              onCopy={(): void => {
                return setCopied(true);
              }}
            >
              <StyledH1>{removeProtocol(message)}</StyledH1>
            </CopyToClipboard>
          </>
        ) : (
          <p tw="pt-1 underline text-lg">{message}</p>
        )}
      </StyledPopupBody>

      {!error && QRView && (
        <div tw="flex justify-center px-4 pt-4 pb-0">
          <QRCode size={128} value={message} />
        </div>
      )}
    </>
  );
};

export default ResponseBody;
