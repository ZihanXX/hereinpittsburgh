=======vv9========
Jul.16-17  local image uploading combine with new item
Jul.17  delete tmpImages
        upload image size, number

TODO: 
* complete the database, all
* other items by this same user
* message when uploading the images: "please be patient"
* refine google map for housing(make it maker instead of circle)
* "are you sure you want to ...?"
* two languages
* create wechat message and copy it with one click
* one-item post / multi-item post(mainly text): images up to 4 / 4
* about pittsburgh (users can add new spots)
* zhushi all the codes
* * wechat Login!! you need it \\I don't!
* contact us (jubao)  there is no us
* Facebook, Wechat, Google LOGIN*
* register email, edu ortherized*
* other register errs like invalid username*
* create pdf or long imaage for items*
* 微信公众号，推送
* 宣传视频，文案


db: hip
* ==========DATABASE========== *

Item_ads        Item_sale       Item_housing    User            Category        Comment         Imgs 
===============|===============|===============|===============|===============|===============|===============
name            name            name            name            name            text            size
myId            myId            myId            email(username) Item            User            urls
id              id              id              id              id              id              
date_crt        date_crt        date_crt        password                        date_update
User            User            User            address*                        Item
descreption     descreption     descreption     wechat
image           image           image/*         wechat_img*
Category        Category        Category        Item
address*        address         address/*       favorites
date_av*        date_av         date_av
                date_note       date_note
isEnd           isEnd           isEnd
                price           price
                price_org       price_org*
orgUrl*         orgUrl          orgUrl*
wechat*         wechat          wechat
wechat_img*     wechat_img*     wechat_img*
                ask/            ask/       
report*         report*         report*
                delivery
date_update     date_update     date_update
 



Class: 家具 电器* 二手书 活动 衣物 租房

* 一次发布单件/多件的问题怎么解决？统一单件，highlight“同一卖家的其他商品”

