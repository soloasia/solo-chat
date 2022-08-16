
type ThemeT = {
    backgroundColor : string,
    textColor : string,
}

type ThemeModeType = {
    [key:string]: ThemeT;
}

const themeStyle : ThemeModeType = {
    light : {backgroundColor : 'white',textColor:'black'},
    dark : {backgroundColor : 'black',textColor:'white'}
};


export default themeStyle;