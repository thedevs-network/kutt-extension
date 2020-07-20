import React from 'react';
import tw, {css, styled} from 'twin.macro';

import BodyWrapper from '../components/BodyWrapper';

const StyledTd = styled.td`
  ${tw`relative flex items-center px-0 py-4`}
`;

const StyledButton = styled.button`
  ${tw`flex items-center justify-center p-0 my-0 transition-all duration-200 ease-out border-none outline-none cursor-pointer`}

  margin-right: 2px;
  margin-left: 12px;
  width: 26px;
  height: 26px;
  box-shadow: rgba(100, 100, 100, 0.1) 0px 2px 4px;
  background-color: rgb(222, 222, 222);
  border-width: initial;
  border-color: initial;
  border-image: initial;
  border-radius: 100%;

  &:hover {
    transform: translateY(-3px);
  }

  img {
    width: 12px;
    height: 12px;
  }
`;

const History: React.FC = () => {
  return (
    <BodyWrapper>
      <div id="history" tw="h-screen flex justify-center px-6 py-8 bg-gray-200">
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
                  tw`mx-0 text-2xl`,

                  css`
                    margin-right: 0.8rem;
                  `,
                ]}
              >
                Recent shortened links. (last 15 results)
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
                <tr
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
                      href="%longLink%"
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                    >
                      %longLink%
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
                    <div tw="flex items-center">
                      <a
                        css={[
                          tw`hover:border-black text-base leading-normal no-underline transition-all duration-200 ease-out border border-transparent border-dotted`,

                          css`
                            color: rgb(33, 150, 243);
                          `,
                        ]}
                        href="%shortLink%"
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                      >
                        %shortLink%
                      </a>
                    </div>
                  </StyledTd>

                  <StyledTd>
                    <div tw="flex items-center justify-end">
                      <StyledButton type="button" title="Copy">
                        <img
                          tw="select-none"
                          src="assets/copy.svg"
                          alt="Copy"
                        />
                      </StyledButton>
                      <StyledButton type="button" title="QR Code">
                        <img
                          tw="select-none"
                          src="assets/qrcode.svg"
                          alt="QR Code"
                        />
                      </StyledButton>
                    </div>
                  </StyledTd>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </BodyWrapper>
  );
};

export default History;
