import CopyToClipboard from 'react-copy-to-clipboard';
import React, {useState, useEffect} from 'react';
import QRCode from 'qrcode.react';
import tw, {styled, css} from 'twin.macro';

import {useRequestStatus} from '../contexts/request-status-context';
import {removeProtocol} from '../util/link';
import Icon from '../components/Icon';

export type ProcessedRequestProperties = {
  error: boolean | null;
  message: string;
};

const StyledPopupBody = styled.div`
  ${tw`flex items-center justify-center px-4 pt-4 pb-0`}

  .icon {
    svg {
      stroke: rgb(101, 189, 137);
      stroke-width: 2;
    }
  }

  h1 {
    border-bottom: 1px dotted ${({theme}): string => theme.statsTotalUnderline};
    padding-bottom: 2px;
    color: rgb(41, 71, 86);

    ${tw`hover:opacity-75 min-w-0 m-0 text-2xl font-light cursor-pointer`}
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
              className="icon"
              css={[
                tw`my-0 ml-0`,

                css`
                  margin-right: 0.4rem;
                `,
              ]}
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
                <Icon tw="my-0 ml-0 mr-3" className="icon" name="copy" />
              </CopyToClipboard>
            ) : (
              <Icon tw="my-0 ml-0 mr-3" className="icon" name="tick" />
            )}
            <CopyToClipboard
              text={message}
              onCopy={(): void => {
                return setCopied(true);
              }}
            >
              <h1>{removeProtocol(message)}</h1>
            </CopyToClipboard>
          </>
        ) : (
          <p tw="pt-1 text-lg text-gray-900 border-b border-gray-700 border-dotted">
            {message}
          </p>
        )}
      </StyledPopupBody>

      {!error && QRView && (
        <div tw="flex justify-center max-w-full pt-4 pb-0">
          <QRCode size={128} value={message} />
        </div>
      )}
    </>
  );
};

export default ResponseBody;
