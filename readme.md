=======vv13========
Jul.29  refine the padding-top of pages
        add explore pittsburgh


TODO: 
* two languages
* cur_item_count on show page*
* message when uploading the images: "please be patient"*
* "are you sure you want to ...?": 1)delete*
* 有bug挂掉怎么办，怎么保证不会挂掉，handle所有err？
* about pittsburgh (users can add new spots)
* zhushi all the codes
* wechat Login!! you need it \\I don't!
* contact us (jubao)  there is no us
* Facebook, Wechat, Google LOGIN*
* register email, edu ortherized*
* create pdf or long imaage for items*
* 微信公众号，推送
* 宣传视频，文案


db: hip
* ==========DATABASE========== *

Item_ads        Item_sale       Item_housing    User            Category        Comment         Imgs 
===============|===============|===============|===============|===============|===============|===============
name            name            name            name            name            text            count
myId            myId            myId            email(username) Item            User            urls
id              id              id              id              id              id              item_id
date_crt        date_crt        date_crt        password                        date_update
User            User            User            address*                        Item
descreption     descreption     descreption     wechat
image           image           image/*         wechat_img*
Category        Category        Category        Item
address*        address         address/*       favorites
date_av*        date_av         date_av
isEnd           isEnd           isEnd
                price           price
orgUrl*         orgUrl          orgUrl*
wechat*         wechat          wechat
report*         report*         report*
                delivery
date_update     date_update     date_update
 

