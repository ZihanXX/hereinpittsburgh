=======vv8========
Jul.16 connect-flash
Jul.16 when the password or username is wrong, alert
        when edit item, change the date_update
        the limits of password and username
        username is email, set another username to save a name
        no duplicate email or personal_name

TODO: 
* local image uploading combine with new item
* complete the database, all
* refine google map for housing(make it maker instead of circle)
* wechat Login!! you need it
* upload image size, number
* "are you sure you want to ...?"
* two languages
* create wechat message and copy it with one click
* one-item post / multi-item post(mainly text): images up to 4 / 4
* other items by this same user
* about pittsburgh (users can add new spots)
* zhushi all the codes
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

