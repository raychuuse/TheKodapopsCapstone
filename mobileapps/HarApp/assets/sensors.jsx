import Svg, { Path } from "react-native-svg";

const SvgSensors = (props) => {
  return (
    <Svg {...props} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M4.66663 16C4.66663 17.4 4.89996 18.7111 5.36663 19.9334C5.83329 21.1556 6.47774 22.2667 7.29996 23.2667C7.47774 23.4889 7.57218 23.7389 7.58329 24.0167C7.5944 24.2945 7.49996 24.5334 7.29996 24.7334C7.09996 24.9334 6.84996 25.0223 6.54996 25C6.24996 24.9778 5.99996 24.8445 5.79996 24.6C4.79996 23.4445 4.02774 22.1389 3.48329 20.6834C2.93885 19.2278 2.66663 17.6667 2.66663 16C2.66663 14.3334 2.93885 12.7723 3.48329 11.3167C4.02774 9.86114 4.79996 8.55559 5.79996 7.40003C5.97774 7.15559 6.21663 7.02781 6.51663 7.0167C6.81663 7.00559 7.06663 7.10003 7.26663 7.30003C7.46663 7.50003 7.56107 7.73892 7.54996 8.0167C7.53885 8.29448 7.4444 8.54448 7.26663 8.7667C6.4444 9.7667 5.80551 10.8723 5.34996 12.0834C4.8944 13.2945 4.66663 14.6 4.66663 16ZM9.99996 16C9.99996 16.6445 10.0944 17.2667 10.2833 17.8667C10.4722 18.4667 10.7555 19.0223 11.1333 19.5334C11.3111 19.7556 11.3888 20.0056 11.3666 20.2834C11.3444 20.5611 11.2333 20.7889 11.0333 20.9667C10.8333 21.1667 10.6 21.2611 10.3333 21.25C10.0666 21.2389 9.8444 21.1223 9.66663 20.9C9.15551 20.2334 8.74996 19.4834 8.44996 18.65C8.14996 17.8167 7.99996 16.9334 7.99996 16C7.99996 15.0667 8.14996 14.1834 8.44996 13.35C8.74996 12.5167 9.15551 11.7667 9.66663 11.1C9.8444 10.8778 10.0666 10.7611 10.3333 10.75C10.6 10.7389 10.8333 10.8334 11.0333 11.0334C11.2333 11.2334 11.3388 11.4723 11.35 11.75C11.3611 12.0278 11.2777 12.2889 11.1 12.5334C10.7444 13.0223 10.4722 13.5611 10.2833 14.15C10.0944 14.7389 9.99996 15.3556 9.99996 16ZM16 18.6667C15.2666 18.6667 14.6388 18.4056 14.1166 17.8834C13.5944 17.3611 13.3333 16.7334 13.3333 16C13.3333 15.2667 13.5944 14.6389 14.1166 14.1167C14.6388 13.5945 15.2666 13.3334 16 13.3334C16.7333 13.3334 17.3611 13.5945 17.8833 14.1167C18.4055 14.6389 18.6666 15.2667 18.6666 16C18.6666 16.7334 18.4055 17.3611 17.8833 17.8834C17.3611 18.4056 16.7333 18.6667 16 18.6667ZM22 16C22 15.3556 21.9055 14.7334 21.7166 14.1334C21.5277 13.5334 21.2444 12.9778 20.8666 12.4667C20.6888 12.2445 20.6111 11.9945 20.6333 11.7167C20.6555 11.4389 20.7666 11.2111 20.9666 11.0334C21.1666 10.8334 21.4 10.7389 21.6666 10.75C21.9333 10.7611 22.1555 10.8778 22.3333 11.1C22.8444 11.7667 23.25 12.5167 23.55 13.35C23.85 14.1834 24 15.0667 24 16C24 16.9334 23.85 17.8167 23.55 18.65C23.25 19.4834 22.8333 20.2445 22.3 20.9334C22.1222 21.1556 21.9055 21.2611 21.65 21.25C21.3944 21.2389 21.1666 21.1334 20.9666 20.9334C20.7666 20.7334 20.6611 20.5 20.65 20.2334C20.6388 19.9667 20.7222 19.7111 20.9 19.4667C21.2555 18.9778 21.5277 18.4389 21.7166 17.85C21.9055 17.2611 22 16.6445 22 16ZM27.3333 16C27.3333 14.6 27.1 13.2889 26.6333 12.0667C26.1666 10.8445 25.5222 9.73336 24.7 8.73336C24.5222 8.51114 24.4277 8.26114 24.4166 7.98336C24.4055 7.70559 24.5 7.4667 24.7 7.2667C24.9 7.0667 25.1555 6.97781 25.4666 7.00003C25.7777 7.02225 26.0222 7.15559 26.2 7.40003C27.2 8.57781 27.9722 9.89448 28.5166 11.35C29.0611 12.8056 29.3333 14.3556 29.3333 16C29.3333 17.6667 29.05 19.2334 28.4833 20.7C27.9166 22.1667 27.1333 23.4889 26.1333 24.6667C25.9555 24.8889 25.7277 25 25.45 25C25.1722 25 24.9333 24.9 24.7333 24.7C24.5333 24.5 24.4388 24.2611 24.45 23.9834C24.4611 23.7056 24.5555 23.4556 24.7333 23.2334C25.5555 22.2334 26.1944 21.1278 26.65 19.9167C27.1055 18.7056 27.3333 17.4 27.3333 16Z"
        fill={"#5EF914"}
      />
      <Path
        fill-rule={"evenodd"}
        clip-rule={"evenodd"}
        d="M9.41233 8.91131C9.6736 8.81935 9.95401 8.7641 10.25 8.75176C11.1121 8.71585 11.8786 9.05021 12.4475 9.61915C12.9962 10.1678 13.3168 10.8803 13.3484 11.6701C13.3552 11.841 13.3484 12.0085 13.3292 12.1719C14.1047 11.6216 15.0121 11.3334 16 11.3334C16.9788 11.3334 17.8785 11.6163 18.6494 12.1568C18.6269 11.9609 18.6234 11.7606 18.6397 11.5572C18.6996 10.8076 19.0188 10.1095 19.594 9.57828C20.1585 9.03425 20.9087 8.71672 21.7499 8.75176C22.0362 8.76369 22.3078 8.81576 22.5617 8.90234C22.4786 8.6345 22.4298 8.35363 22.4182 8.0633C22.3844 7.21682 22.6989 6.43937 23.2857 5.85248C23.941 5.19723 24.7863 4.94634 25.6091 5.00511C26.4576 5.06572 27.227 5.45748 27.7627 6.15062C28.8948 7.49429 29.7718 8.99698 30.3899 10.6494C31.0229 12.3418 31.3333 14.1304 31.3333 16C31.3333 17.8982 31.0096 19.7107 30.3489 21.4208C29.7057 23.0856 28.8131 24.5966 27.6725 25.9439C27.1268 26.6101 26.3401 27 25.45 27C24.631 27 23.8865 26.6816 23.3191 26.1142C22.7322 25.5274 22.4177 24.7499 22.4516 23.9034C22.4626 23.6262 22.5076 23.3576 22.584 23.1008C22.2716 23.2098 21.9294 23.2641 21.5631 23.2481C20.7532 23.2129 20.0657 22.8609 19.5524 22.3476C19.0209 21.8161 18.685 21.1164 18.6517 20.3166C18.6448 20.1501 18.6511 19.9874 18.6694 19.8292C17.8941 20.3788 16.9873 20.6667 16 20.6667C15.0211 20.6667 14.1214 20.3837 13.3506 19.8433C13.373 20.0391 13.3765 20.2395 13.3603 20.4429C13.3003 21.1924 12.9811 21.8905 12.4059 22.4218C11.8415 22.9658 11.0912 23.2833 10.25 23.2483C9.96376 23.2364 9.69209 23.1843 9.4382 23.0977C9.52133 23.3656 9.57008 23.6464 9.58169 23.9368C9.61555 24.7832 9.30106 25.5607 8.71417 26.1476C8.0739 26.7878 7.24058 27.0567 6.40222 26.9946C5.53709 26.9305 4.79947 26.5225 4.27302 25.8919C3.12199 24.5578 2.23365 23.0512 1.61005 21.384C0.97588 19.6886 0.666626 17.8885 0.666626 16C0.666626 14.1115 0.97588 12.3114 1.61005 10.616C2.22846 8.96272 3.10721 7.46739 4.24431 6.14155C4.7794 5.45455 5.55896 5.0508 6.4426 5.01807C7.26005 4.98779 8.06128 5.26626 8.68084 5.88582C9.26773 6.47271 9.58222 7.25016 9.54836 8.09663C9.5371 8.37817 9.49091 8.65081 9.41233 8.91131ZM5.79996 7.40003C4.79996 8.55559 4.02774 9.86114 3.48329 11.3167C2.93885 12.7723 2.66663 14.3334 2.66663 16C2.66663 17.6667 2.93885 19.2278 3.48329 20.6834C4.02774 22.1389 4.79996 23.4445 5.79996 24.6C5.99996 24.8445 6.24996 24.9778 6.54996 25C6.84996 25.0223 7.09996 24.9334 7.29996 24.7334C7.49996 24.5334 7.5944 24.2945 7.58329 24.0167C7.57218 23.7389 7.47774 23.4889 7.29996 23.2667C6.47774 22.2667 5.83329 21.1556 5.36663 19.9334C4.89996 18.7111 4.66663 17.4 4.66663 16C4.66663 14.6 4.8944 13.2945 5.34996 12.0834C5.80551 10.8723 6.4444 9.7667 7.26663 8.7667C7.27867 8.75165 7.29033 8.73647 7.3016 8.72116C7.30486 8.71675 7.30807 8.71232 7.31126 8.70789C7.31895 8.69719 7.32646 8.68643 7.33378 8.67562C7.35834 8.6393 7.38083 8.60229 7.40123 8.56459C7.49252 8.39586 7.5421 8.21323 7.54996 8.0167C7.56107 7.73892 7.46663 7.50003 7.26663 7.30003C7.06663 7.10003 6.81663 7.00559 6.51663 7.0167C6.21663 7.02781 5.97774 7.15559 5.79996 7.40003ZM11.0333 20.9667C11.2333 20.7889 11.3444 20.5611 11.3666 20.2834C11.3837 20.0702 11.3418 19.8734 11.2411 19.6929C11.2344 19.6809 11.2275 19.669 11.2202 19.6571C11.2074 19.636 11.1937 19.6151 11.1791 19.5944C11.1647 19.5738 11.1494 19.5535 11.1333 19.5334C10.7788 19.0537 10.5074 18.535 10.3193 17.9771C10.3069 17.9405 10.2949 17.9037 10.2833 17.8667C10.1527 17.452 10.0673 17.0267 10.027 16.5908C10.009 16.396 9.99996 16.1991 9.99996 16C9.99996 15.7108 10.019 15.4272 10.057 15.1492C10.1037 14.8077 10.1792 14.4747 10.2833 14.15C10.2967 14.1081 10.3106 14.0664 10.3249 14.025C10.4905 13.5452 10.7128 13.0993 10.9917 12.6875C11.0269 12.6356 11.063 12.5842 11.1 12.5334C11.1241 12.5002 11.1464 12.4668 11.167 12.433C11.175 12.42 11.1827 12.407 11.1901 12.3939C11.2 12.3765 11.2094 12.359 11.2184 12.3414C11.2248 12.329 11.2309 12.3164 11.2368 12.3039C11.32 12.1273 11.3577 11.9427 11.35 11.75C11.3388 11.4723 11.2333 11.2334 11.0333 11.0334C10.8333 10.8334 10.6 10.7389 10.3333 10.75C10.0666 10.7611 9.8444 10.8778 9.66663 11.1C9.54714 11.2559 9.43342 11.4163 9.32546 11.5813C8.97166 12.1219 8.67982 12.7115 8.44996 13.35C8.42716 13.4134 8.40523 13.477 8.38417 13.5409C8.24123 13.9745 8.13818 14.4214 8.075 14.8816C8.02497 15.2461 7.99996 15.6189 7.99996 16C7.99996 16.2605 8.01164 16.517 8.035 16.7697C8.08916 17.3554 8.20608 17.9202 8.38578 18.4641C8.40635 18.5263 8.42774 18.5883 8.44996 18.65C8.71519 19.3868 9.06293 20.0584 9.49317 20.6649C9.5057 20.6825 9.5183 20.7001 9.53097 20.7177C9.54584 20.7383 9.56082 20.7588 9.57588 20.7793C9.60575 20.8198 9.636 20.8601 9.66663 20.9C9.8444 21.1223 10.0666 21.2389 10.3333 21.25C10.6 21.2611 10.8333 21.1667 11.0333 20.9667ZM21.9729 15.4092C21.9909 15.604 22 15.801 22 16C22 16.2892 21.9809 16.5728 21.9429 16.8508C21.8962 17.1923 21.8208 17.5254 21.7166 17.85C21.7032 17.892 21.6893 17.9336 21.675 17.975C21.4886 18.5154 21.2302 19.0126 20.9 19.4667C20.8671 19.5119 20.8374 19.5575 20.811 19.6035C20.7924 19.6359 20.7753 19.6685 20.7599 19.7013C20.7553 19.7111 20.7509 19.7209 20.7466 19.7307C20.675 19.8936 20.6428 20.0612 20.65 20.2334C20.6611 20.5 20.7666 20.7334 20.9666 20.9334C21.1666 21.1334 21.3944 21.2389 21.65 21.25C21.9055 21.2611 22.1222 21.1556 22.3 20.9334C22.3741 20.8376 22.446 20.7404 22.5157 20.6418C22.5256 20.6278 22.5354 20.6137 22.5452 20.5997C22.9627 20.0009 23.2976 19.351 23.55 18.65C23.5728 18.5867 23.5947 18.5231 23.6158 18.4592C23.7591 18.0244 23.8623 17.5762 23.9254 17.1147C23.9751 16.7514 24 16.3799 24 16C24 15.7394 23.9883 15.4826 23.9649 15.2298C23.9107 14.6443 23.7938 14.0797 23.6141 13.536C23.5936 13.4737 23.5722 13.4117 23.55 13.35C23.2847 12.6133 22.937 11.9417 22.5068 11.3352C22.4942 11.3175 22.4816 11.2999 22.469 11.2824C22.4541 11.2618 22.4391 11.2412 22.424 11.2208C22.3942 11.1802 22.3639 11.14 22.3333 11.1C22.1555 10.8778 21.9333 10.7611 21.6666 10.75C21.4 10.7389 21.1666 10.8334 20.9666 11.0334C20.7666 11.2111 20.6555 11.4389 20.6333 11.7167C20.6162 11.9299 20.6581 12.1267 20.7588 12.3071C20.7655 12.3191 20.7725 12.3311 20.7797 12.3429C20.7926 12.3641 20.8063 12.385 20.8208 12.4057C20.8353 12.4262 20.8505 12.4466 20.8666 12.4667C21.2211 12.9463 21.4925 13.4651 21.6806 14.023C21.693 14.0596 21.705 14.0964 21.7166 14.1334C21.8472 14.548 21.9326 14.9733 21.9729 15.4092ZM26.1333 24.6667C26.1804 24.6113 26.227 24.5555 26.2731 24.4994C26.2787 24.4925 26.2844 24.4856 26.29 24.4788C26.3073 24.4576 26.3246 24.4364 26.3417 24.4152C27.2428 23.3016 27.9566 22.0632 28.4833 20.7C28.4938 20.6727 28.5043 20.6454 28.5146 20.6181C29.0604 19.175 29.3333 17.6357 29.3333 16C29.3333 14.3556 29.0611 12.8056 28.5166 11.35C27.9722 9.89448 27.2 8.57781 26.2 7.40003C26.0222 7.15559 25.7777 7.02225 25.4666 7.00003C25.1555 6.97781 24.9 7.0667 24.7 7.2667C24.5 7.4667 24.4055 7.70559 24.4166 7.98336C24.4251 8.19585 24.4824 8.39209 24.5884 8.57206C24.5997 8.59128 24.6116 8.6103 24.624 8.62915C24.6293 8.63712 24.6347 8.64506 24.6401 8.65296C24.6589 8.68016 24.6788 8.70696 24.7 8.73336C25.5222 9.73336 26.1666 10.8445 26.6333 12.0667C27.1 13.2889 27.3333 14.6 27.3333 16C27.3333 17.4 27.1055 18.7056 26.65 19.9167C26.6417 19.9385 26.6335 19.9603 26.6251 19.9821C26.1713 21.1676 25.5407 22.2514 24.7333 23.2334C24.7159 23.2551 24.6993 23.2771 24.6835 23.2994C24.6631 23.3282 24.644 23.3574 24.6262 23.3871C24.6162 23.4039 24.6066 23.4209 24.5974 23.4379C24.5069 23.606 24.4578 23.7878 24.45 23.9834C24.4388 24.2611 24.5333 24.5 24.7333 24.7C24.9333 24.9 25.1722 25 25.45 25C25.7277 25 25.9555 24.8889 26.1333 24.6667ZM14.1166 17.8834C14.6388 18.4056 15.2666 18.6667 16 18.6667C16.7333 18.6667 17.3611 18.4056 17.8833 17.8834C18.4055 17.3611 18.6666 16.7334 18.6666 16C18.6666 15.2667 18.4055 14.6389 17.8833 14.1167C17.3611 13.5945 16.7333 13.3334 16 13.3334C15.2666 13.3334 14.6388 13.5945 14.1166 14.1167C13.5944 14.6389 13.3333 15.2667 13.3333 16C13.3333 16.7334 13.5944 17.3611 14.1166 17.8834Z"
        fill={"#309700"}
      />
    </Svg>
  );
};

export default SvgSensors;
