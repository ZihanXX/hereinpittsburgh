=======vv6========
Jul.8 upload local image, finally!!!(test in vv1)
Jul.9 refine the uploading, and db accordingly. The uploading wasn't done actually
Jul.10 Try another solution, worked!(test in vv1)
Jul.11-12 Refine the uploading(try.js, addImages, addImages1)
Jul.14 sort with date_update
Jul.14 try google map api
Jul.15 solve the problem of uploading 

TODO: 
* Facebook, Wechat, Google LOGIN
* Google Map
* local image
* two languages
* about pittsburgh
* zhushi all the codes
* register email, edu ortherized
        

* db: hip

* ==========DATABASE========== *

Item_ads        Item_sale       Item_housing    User            Category        Comment         Imgs 
===============|===============|===============|===============|===============|===============|===============
name            name            name            name            name            text            size
myId            myId            myId            email           Item            User            urls
id              id              id              id              id              id              
date_crt        date_crt        date_crt        password                        date_update
User            User            User            address                         Item
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

