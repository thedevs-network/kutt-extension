import tw, {css} from 'twin.macro';
import QRCode from 'qrcode.react';
import React from 'react';

type Props = {
  link: string;
  setModalView: React.Dispatch<React.SetStateAction<boolean>>;
};

const Modal: React.FC<Props> = ({link, setModalView}) => {
  return (
    <>
      <div
        css={[
          tw`fixed top-0 left-0 flex items-center justify-center w-full h-full`,

          css`
            background-color: rgba(50, 50, 50, 0.8);
            z-index: 1000;
          `,
        ]}
      >
        <div
          css={[
            tw`px-16 py-12 text-center bg-white`,

            css`
              border-radius: 8px;
            `,
          ]}
        >
          <div>
            <QRCode size={196} value={link} />
          </div>

          <div tw="flex justify-center mt-10">
            <button
              onClick={(): void => setModalView(false)}
              css={[
                tw`relative flex items-center justify-center h-10 px-8 py-0 mx-4 my-0 overflow-hidden text-sm leading-none text-center text-black transition-all ease-out cursor-pointer`,

                css`
                  border-radius: 100px;
                  transition-duration: 400ms;
                  background: linear-gradient(
                    to right,
                    rgb(224, 224, 224),
                    rgb(189, 189, 189)
                  );
                  box-shadow: rgba(160, 160, 160, 0.5) 0px 5px 6px;
                `,
              ]}
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
