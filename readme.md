=======vv12========
Jul.22  edit page
        isEnd
        upload file too large alert* [no]
        type in password twice
Jul.27  copy wechat info to clipboard
        各种required输入，各种输入的长度限制格式限制
        square the card
        各种格式
        one-item post / multi-item post(mainly text): images up to 4 / 4
        create wechat message and copy it with one click
Jul.28  new/show differrent category
        refine google map for housing(make it maker instead of circle)
        refine everything
Jul.29  fix uploading bugs
        upload errs


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
 



Class: 家具 电器* 二手书 活动 衣物 租房

* 一次发布单件/多件的问题怎么解决？统一单件，highlight“同一卖家的其他商品”

