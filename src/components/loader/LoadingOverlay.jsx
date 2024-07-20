import React from 'react';

const LoadingOverlay = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-300 bg-opacity-50 z-50">
            <div className="loader"></div>
            <style jsx>{`
        .loader,
        .loader:before,
        .loader:after {
          border-radius: 50%;
        }
        .loader {
          color: #ffffff;
          font-size: 11px;
          text-indent: -9999em;
          margin: 55px auto;
          position: relative;
          width: 10em;
          height: 10em;
          box-shadow: inset 0 0 0 1em;
          transform: translateZ(0);
        }
        .loader:before,
        .loader:after {
          position: absolute;
          content: '';
        }
        .loader:before {
          width: 5.2em;
          height: 10.2em;
          background: #000;
          border-radius: 10.2em 0 0 10.2em;
          top: -0.1em;
          left: -0.1em;
          transform-origin: 5.1em 5.1em;
          animation: load2 2s infinite ease 1.5s;
        }
        .loader:after {
          width: 5.2em;
          height: 10.2em;
          background: #000;
          border-radius: 0 10.2em 10.2em 0;
          top: -0.1em;
          left: 5.1em;
          transform-origin: 0.1em 5.1em;
          animation: load2 2s infinite ease;
        }
        @keyframes load2 {
          0%,
          100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(180deg);
          }
        }
      `}</style>
        </div>
    );
};

export default LoadingOverlay;
