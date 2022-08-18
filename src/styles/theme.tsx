import { backgroundDark, boxColor, greyDark, primaryDark } from "../config/colors";

type ThemeT = {
    backgroundColor : string,
    textColor : string,
    primary : string
}

type ThemeModeType = {
    [key:string]: ThemeT;
}

const themeStyle : ThemeModeType = {
    light : {backgroundColor : 'white',textColor:'black',primary : boxColor},
    dark : {backgroundColor : backgroundDark, textColor: greyDark, primary: primaryDark}
};


export default themeStyle;