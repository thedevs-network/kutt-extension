import CopyToClipboard from 'react-copy-to-clipboard';
import React, {useEffect, useState} from 'react';
import tw, {css, styled} from 'twin.macro';

import {
  useShortenedLinks,
  ShortenedLinksActionTypes,
} from '../contexts/shortened-links-context';
import {MAX_HISTORY_ITEMS} from '../Background/constants';

import Icon from '../components/Icon';
import Modal from './Modal';

const StyledTd = styled.td`
  ${tw`relative flex items-center px-0 py-4`}
`;

const StyledIcon = styled(Icon)`
  ${tw`flex items-center justify-center p-0 my-0 transition-all duration-200 ease-out border-none outline-none cursor-pointer`}

  margin-right: 2px;
  margin-left: 12px;
  width: 26px;
  height: 26px;
  box-shadow: rgba(100, 100, 100, 0.1) 0px 2px 4px;
  background-color: rgb(222, 222, 222);
  border-radius: 100%;

  &:hover {
    transform: translateY(-3px);
  }

  svg {
    stroke: rgb(101, 189, 137);
    stroke-width: 2;
  }
`;

const Table: React.FC = () => {
  const [shortenedLinksState, shortenedLinksDispatch] = useShortenedLinks();
  const [QRView, setQRView] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // reset copy message
  useEffect(() => {
    setTimeout(() => {
      setCopied(false);
      // reset selected id from context
    }, 1300);
  }, [copied]);

  function handleCopyToClipboard(selectedItemId: string): void {
    shortenedLinksDispatch({
      type: ShortenedLinksActionTypes.SET_CURRENT_SELECTED,
      payload: selectedItemId,
    });

    setCopied(true);
  }

  function handleQRCodeViewToggle(selectedItemId: string): void {
    shortenedLinksDispatch({
      type: ShortenedLinksActionTypes.SET_CURRENT_SELECTED,
      payload: selectedItemId,
    });

    setQRView(true);
  }

  return (
    <>
      <div
        css={[
          tw` flex flex-col items-center w-full min-h-screen`,

          css`
            flex: 0 0 auto;
          `,
        ]}
      >
        <div
          css={[
            tw`flex flex-col mx-0 mt-10 mb-32`,

            css`
              width: 1200px;
              max-width: 95%;
            `,
          ]}
        >
          <div tw="flex items-center justify-center">
            <h2
              css={[
                tw`mx-0 text-xl`,

                css`
                  margin-right: 0.8rem;
                `,
              ]}
            >
              Recent shortened links. (last {MAX_HISTORY_ITEMS} results)
            </h2>
          </div>
          <table
            css={[
              tw`flex flex-col flex-auto bg-white`,

              css`
                border-radius: 12px;
                box-shadow: rgba(50, 50, 50, 0.2) 0px 6px 30px;
              `,
            ]}
          >
            <thead
              css={[
                tw`flex flex-col flex-auto`,

                css`
                  background-color: rgb(241, 241, 241);
                  border-top-right-radius: 12px;
                  border-top-left-radius: 12px;
                `,
              ]}
            >
              <tr
                css={[
                  tw`flex justify-between flex-auto px-6 py-0`,

                  css`
                    border-bottom: 1px solid rgb(234, 234, 234);
                  `,
                ]}
              >
                <th
                  css={[
                    tw`relative flex items-center justify-start px-0 py-4 text-base leading-normal`,

                    css`
                      flex: 2 2 0px;
                    `,
                  ]}
                >
                  Original URL
                </th>
                <th
                  css={[
                    tw`relative flex items-center justify-start px-0 py-4 text-base leading-normal`,

                    css`
                      flex: 1 1 0px;
                    `,
                  ]}
                >
                  Short URL
                </th>
              </tr>
            </thead>
            <tbody tw="flex flex-col flex-auto">
              {!(shortenedLinksState.total === 0) ? (
                shortenedLinksState.items.map((item) => {
                  return (
                    <tr
                      key={item.id}
                      css={[
                        tw`flex justify-between flex-auto px-6 py-0`,

                        css`
                          border-bottom: 1px solid rgb(234, 234, 234);
                        `,
                      ]}
                    >
                      <StyledTd
                        css={[
                          tw`relative overflow-hidden whitespace-no-wrap`,

                          css`
                            flex: 2 2 0px;

                            &::after {
                              content: '';
                              position: absolute;
                              right: 0px;
                              top: 0px;
                              height: 100%;
                              width: 56px;
                              background: linear-gradient(
                                to left,
                                white,
                                white,
                                transparent
                              );
                            }
                          `,
                        ]}
                      >
                        <a
                          css={[
                            tw`hover:border-black text-base leading-normal no-underline transition-all duration-200 ease-out border border-transparent border-dotted`,

                            css`
                              color: rgb(33, 150, 243);
                            `,
                          ]}
                          href={item.target}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                        >
                          {item.target}
                        </a>
                      </StyledTd>

                      <StyledTd
                        css={[
                          tw`relative overflow-hidden whitespace-no-wrap`,

                          css`
                            flex: 1 1 23px;

                            &::after {
                              content: '';
                              position: absolute;
                              right: 0px;
                              top: 0px;
                              height: 100%;
                              width: 56px;
                              background: linear-gradient(
                                to left,
                                white,
                                white,
                                transparent
                              );
                            }
                          `,
                        ]}
                      >
                        {copied &&
                          shortenedLinksState.selected?.id === item.id && (
                            <div
                              css={[
                                tw`absolute top-0 left-0 text-xs text-green-900`,

                                css`
                                  font-size: 11px;
                                `,
                              ]}
                            >
                              Copied to clipboard!
                            </div>
                          )}

                        <div tw="flex items-center">
                          <a
                            css={[
                              tw`hover:border-black text-base leading-normal no-underline transition-all duration-200 ease-out border border-transparent border-dotted`,

                              css`
                                color: rgb(33, 150, 243);
                              `,
                            ]}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                          >
                            {item.link}
                          </a>
                        </div>
                      </StyledTd>

                      <StyledTd>
                        <div tw="flex items-center justify-end">
                          {/* // **** COPY TO CLIPBOARD **** // */}

                          {copied &&
                          shortenedLinksState.selected?.id === item.id ? (
                            <StyledIcon name="tick" className="icon" />
                          ) : (
                            <CopyToClipboard
                              text={item.link}
                              onCopy={(): void => {
                                return handleCopyToClipboard(item.id);
                              }}
                            >
                              <StyledIcon name="copy" className="icon" />
                            </CopyToClipboard>
                          )}

                          <StyledIcon
                            onClick={(): void =>
                              handleQRCodeViewToggle(item.id)
                            }
                            className="icon"
                            name="qrcode"
                          />
                        </div>

                        {/* // **** QR CODE MODAL **** // */}
                        {QRView &&
                          shortenedLinksState.selected?.id === item.id && (
                            <Modal link={item.link} setModalView={setQRView} />
                          )}
                      </StyledTd>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td>No URLs History</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Table;
