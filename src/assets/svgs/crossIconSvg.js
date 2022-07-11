import * as React from "react"
import Svg, { Path } from "react-native-svg"

const CrossIconSvg = (props) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M16.398 7.602a1.186 1.186 0 0 0-1.683 0L12 10.328 9.285 7.603a1.19 1.19 0 0 0-1.683 1.683L10.328 12l-2.726 2.715a1.186 1.186 0 0 0 0 1.683 1.184 1.184 0 0 0 1.683 0L12 13.672l2.715 2.726a1.185 1.185 0 0 0 1.683 0 1.185 1.185 0 0 0 0-1.683L13.672 12l2.726-2.715a1.184 1.184 0 0 0 0-1.683Zm3.983-3.983A11.854 11.854 0 1 0 3.619 20.381 11.855 11.855 0 1 0 20.381 3.619Zm-1.672 15.09A9.483 9.483 0 1 1 21.483 12a9.426 9.426 0 0 1-2.774 6.71Z"
      fill="#fff"
    />
  </Svg>
)

export default CrossIconSvg;
