import moment from "moment"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { baseColor } from "../config/colors"
import i18n from "i18n-js";

export const data = [
    // {
    //     name: 'Profile',
    //     icon: 'person',
    //     color: "#8F9AA8",
    //     to:'AuthOption'
    // },
    {
        name: "qr_code",//i18n.t("qr_code"),
        icon: 'qr-code-outline',
        color: "#1772F7",
        to:'QRcode'
    },
    // {
    //     name: 'Save Message',
    //     icon: 'bookmarks-outline',
    //     color: "#85CDD1",
    //     to:''
    // }
]

export const seconddata = [
    {
        name: "notification",//i18n.t("notification"),
        icon: 'notifications-outline',
        color: "#E88A96",
        to:''
    },
    // {
    //     name: "appearance",//i18n.t("appearance"),
    //     icon: 'color-palette-outline',
    //     color: "#1772F7",
    //     to:'Appearance'
    // },
    {
        name: "language",//i18n.t("language"),
        icon: 'globe-outline',
        color: baseColor, //"#8F9AA8",
        to:'Language'
    },
    {
        name: "privacy",
        icon: 'shield-checkmark-outline',
        color: "#F0D671",
        to:''
    }
]

export const options = [
   {
        name: 'Video',
        icon: 'videocam-outline',
   },
   {
        name: 'Record Video',
        icon: 'videocam',
    },
    {
        name: 'File',
        icon: 'attach-outline',
    }

]

export const actionChatProfile = [
    {
        title: 'create_group_chat',
        icon: 'account-group',
        type: MaterialCommunityIcons,
        to:''
    },
    {
        title: 'media_files_links',
        icon: 'photo-size-select-actual',
        type: MaterialIcons,
        to: 'Mediafile'
    },
    {
        title: 'notification',
        icon: 'notifications',
        type: Ionicons,
        to: 'ProfileNoti'
    },
]
export const actionGroupChatProfile = [
    {
        title: 'members',
        icon: 'account-group',
        type: MaterialCommunityIcons,
        to:'Members'
    },
    {
        title: 'media_files_links',
        icon: 'photo-size-select-actual',
        type: MaterialIcons,
        to: 'Mediafile'
    },
    {
        title: 'notification',
        icon: 'notifications',
        type: Ionicons,
        to: 'ProfileNoti'
    },
    {
        title: 'leave_group',
        icon: 'log-out-outline',
        type: Ionicons,
        to: ''
    },
    {
        title: 'delete_group',
        icon: 'close',
        type: Ionicons,
        to: ''
    },
]

 // chatData.map((item:any,index:any)=>{
                //     let keys = Object.keys(item)[index]
                //     if(moment(result.data.created_at).format('YYYY-MM-DD') == keys){
                //         let mergeArray:any = [...item[keys],result.data];
                //         setChatData([{[keys]:mergeArray}])
        
                //     }
                // })

                // <FlatList
                //                     style={{paddingHorizontal: main_padding}}
                //                     ref={ref}
                //                     listKey={makeid()}
                //                     renderItem={Item}
                //                     data={chatData}
                //                     keyExtractor={(_, index) => index.toString()}
                //                     initialNumToRender={chatData.length}
                //                     ListHeaderComponent={
                //                         <>
                //                             {isMoreLoading && lastDoc !== 0 && renderFooter()}
                //                             <Footer />
                //                         </>
                //                     }
                //                     ListFooterComponent={
                //                         <>
                //                             <View style={{
                //                                 height: insets.bottom > 0 ? (insets.bottom + 20):70
                //                             }} />
                //                         </>
                //                     }
                //                     onContentSizeChange={() => {
                //                         if (lastDoc == 1 && isTranslate.length == 0) {
                //                             ref.current != null ? ref.current.scrollToEnd({ animated: true}) : {}
                //                         }
                //                     }}
                //                     refreshControl={
                //                         <RefreshControl refreshing={isMoreLoading} onRefresh={getMore} colors={[themeStyle[theme].textColor]}  tintColor={themeStyle[theme].textColor}/>
                //                     }
				// 	                onTouchMove={_onScroll}
                //                     scrollEventThrottle={16}
                //                     onEndReachedThreshold={0.5}
                //                 />

            //     <ScrollView
            //     ref={scrollRef}
            //     showsVerticalScrollIndicator={false}
            //     showsHorizontalScrollIndicator={false}
            //     onContentSizeChange={() => {
            //         if (lastDoc == 1 && isTranslate.length == 0) {
            //             scrollRef.current.scrollToEnd({y:0,animated: true})
            //         }
            //         }
            //     }
            //     nestedScrollEnabled
            //     alwaysBounceVertical={false}
            //     scrollEventThrottle={400}
            //     pinchGestureEnabled={false}
            //     onScroll={({ nativeEvent }) => {
            //         reactotron.log(nativeEvent)
            //         if (ifCloseToTop(nativeEvent)) {
            //             getMore();
            //         }
            //     }}
            //     contentInset={{
            //         top: 10,
            //         left: 30,
            //         bottom: 0,
            //         right: 30,
            //     }}
            // >
            //     <View style={{padding:main_padding,paddingTop:0}}>
            //         {chatData.map((item:any,index:any)=>Item(item,index))}
            //     </View>
            // </ScrollView>