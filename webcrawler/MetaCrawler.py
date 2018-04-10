from lxml import html
import requests
import json
import time


class GameCrawler:
    def __init__(self, url):
        self.url = url


    def crawl(self, url):
        headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'}

        game_html = requests.get(url, headers=headers)

        tree = html.fromstring(game_html.text)
        game_data = {}
        game_data["title"] = tree.xpath('//span[@itemprop="name"]/h1/text()')[0]
        game_data["avg_score"] = tree.xpath('//span[@itemprop="ratingValue"]/text()')[0]
        game_data["platforms"] = [tree.xpath('//span[@itemprop="device"]/text()')[0].strip()]
        game_data["platforms"] += tree.xpath('//ul[@class="summary_details"]//*/a[@class="hover_none"]/text()')
        game_data["image_url"] = tree.xpath('//meta[@itemprop="image"]/@content')[0]
        game_data["publisher"] = tree.xpath('//li[@itemprop="publisher"]//*/span[@itemprop="name"]/text()')[0].strip()

        game_data["summary"] = tree.xpath('//ul[@class="summary_details"]//*/span[@itemprop="description"]/text()')
        if(game_data["summary"] == []):
            game_data["summary"] = "N/A"
        else:
            game_data["summary"] = game_data["summary"][0].strip()
        game_data["release_date"] = tree.xpath('//ul[@class="summary_details"]//*/span[@itemprop="datePublished"]/text()')[0]
        game_data["genres"] = tree.xpath('//ul[@class="summary_details"]//*/span[@itemprop="genre"]/text()')
        game_data["rating"] = tree.xpath('//ul[@class="summary_details"]//*/span[@itemprop="contentRating"]/text()')
        if(game_data["rating"] == []):
            game_data["rating"] = "N/A"
        else:
            game_data["rating"] = game_data["rating"][0]


        '''name = tree.xpath('//span[@itemprop="name"]/h1/text()')[0]
        score = tree.xpath('//span[@itemprop="ratingValue"]/text()')[0]
        platforms = [tree.xpath('//span[@itemprop="device"]/text()')[0].strip()]
        platforms += tree.xpath('//ul[@class="summary_details"]//*/a[@class="hover_none"]/text()')
        image_url = tree.xpath('//meta[@itemprop="image"]/@content')[0]
        publisher = tree.xpath('//li[@itemprop="publisher"]//*/span[@itemprop="name"]/text()')[0].strip()
        summary = tree.xpath('//ul[@class="summary_details"]//*/span[@class="blurb blurb_collapsed"]/text()')[0].strip()
        date = tree.xpath('//ul[@class="summary_details"]//*/span[@itemprop="datePublished"]/text()')[0]
        genres = tree.xpath('//ul[@class="summary_details"]//*/span[@itemprop="genre"]/text()')
        rating = tree.xpath('//ul[@class="summary_details"]//*/span[@itemprop="contentRating"]/text()')[0]
        print name
        print score
        print platforms
        print image_url
        print publisher
        print summary
        print date
        print genres
        print rating'''



        crit_reivews_page_url = "http://www.metacritic.com" + tree.xpath('//li[@class="nav nav_critic_reviews"]//*/a[@class="action"]/@href')[0]
        #print crit_reivews_page_url

        review_html = requests.get(crit_reivews_page_url, headers=headers)
        tree = html.fromstring(review_html.text)






        reviewer_names = tree.xpath('//ol[@class="reviews critic_reviews"]//*/div[@class="review_critic"]//*/text()[not(ancestor::*[@class="date"])]')
        reviewer_scores = tree.xpath('//ol[@class="reviews critic_reviews"]//*/div[@class="review_grade"]//*/text()')
        reviewer_reviews = tree.xpath('//ol[@class="reviews critic_reviews"]//*/div[@class="review_body"]/text()')
        reviewer_reviews = [x.strip() for x in reviewer_reviews]
        reviewer_reviews = [x.encode('UTF-8') for x in reviewer_reviews]
        reviews = []
        for x in xrange(len(reviewer_scores)):
            if len(reviewer_scores)-1 < x:
                reviews.append([reviewer_names[x], 'N/A', reviewer_reviews[x]])
            else:
                reviews.append([reviewer_names[x],"Critic", reviewer_scores[x], reviewer_reviews[x]])

        game_data["reviews"] = reviews

        #print len(reviewer_names)
        #print reviewer_names
        #print len(reviewer_scores)
        #print reviewer_scores
        #print len(reviewer_reviews)
        #print reviews

        user_reivews_page_url = "http://www.metacritic.com" + tree.xpath('//li[@class="nav nav_user_reviews"]//*/a[@class="action"]/@href')[0]

        review_html = requests.get(user_reivews_page_url, headers=headers)
        tree = html.fromstring(review_html.text)

        for br in tree.xpath('//ol[@class="reviews user_reviews"]//*/div[@class="review_body"]//*/br'):
            br.getparent().remove(br)


        reviewer_names = tree.xpath('//ol[@class="reviews user_reviews"]//*/div[@class="name"]//*/text()')
        #reviewer_reviews = [x.strip() for x in reviewer_names]
        reviewer_scores = tree.xpath('//ol[@class="reviews user_reviews"]//*/div[@class="review_grade"]//*/text()')
        reviewer_reviews = tree.xpath('//ol[@class="reviews user_reviews"]//*/div[@class="review_body"]//*/text()[not(ancestor::*[@class="blurb blurb_collapsed"]) and not(ancestor::*[@class="blurb_etc"]) and not(ancestor::*[@class="toggle_expand_collapse toggle_expand"]) and not(ancestor::strong)]')
        reviewer_reviews = [x.strip() for x in reviewer_reviews]
        reviewer_reviews = [x.encode('UTF-8') for x in reviewer_reviews]
        reviews = []
        for x in reviewer_reviews:
            if len(x) == 0:
                reviewer_reviews.remove(x)

        for x in xrange(len(reviewer_scores)):
            if len(reviewer_scores)-1 < x:
                reviews.append([reviewer_names[x], 'N/A', reviewer_reviews[x]])
            else:
                reviews.append([reviewer_names[x],"User", reviewer_scores[x], reviewer_reviews[x]])

        game_data["reviews"] += reviews




        pages = tree.xpath('//li[@class="page last_page"]/a/text()')
        #print pages

        if(pages != []):
            pages = pages[0]
            pages = int(pages)
            user_reivews_page_url = user_reivews_page_url + '?page='
            for x in xrange(1, pages):
                #print user_reivews_page_url + str(x)
                list_html = requests.get(user_reivews_page_url + str(x), headers=headers)
                tree = html.fromstring(list_html.text)

                for br in tree.xpath('//ol[@class="reviews user_reviews"]//*/div[@class="review_body"]//*/br'):
                    br.getparent().remove(br)


                reviewer_names = tree.xpath('//ol[@class="reviews user_reviews"]//*/div[@class="name"]//*/text()')
                #reviewer_reviews = [x.strip() for x in reviewer_names]
                reviewer_scores = tree.xpath('//ol[@class="reviews user_reviews"]//*/div[@class="review_grade"]//*/text()')
                reviewer_reviews = tree.xpath('//ol[@class="reviews user_reviews"]//*/div[@class="review_body"]//*/text()[not(ancestor::*[@class="blurb blurb_collapsed"]) and not(ancestor::*[@class="blurb_etc"]) and not(ancestor::*[@class="toggle_expand_collapse toggle_expand"]) and not(ancestor::strong)]')
                reviewer_reviews = [x.strip() for x in reviewer_reviews]
                reviewer_reviews = [x.encode('UTF-8') for x in reviewer_reviews]
                reviews = []
                for x in reviewer_reviews:
                    if len(x) == 0:
                        reviewer_reviews.remove(x)

                for x in xrange(len(reviewer_scores)):
                    if len(reviewer_scores)-1 < x:
                        reviews.append([reviewer_names[x], 'N/A', reviewer_reviews[x]])
                    else:
                        reviews.append([reviewer_names[x],"User", reviewer_scores[x], reviewer_reviews[x]])

                game_data["reviews"] += reviews


        #print len(reviewer_names)
        #print reviewer_names
        #print len(reviewer_scores)
        #print reviewer_scores
        #print len(reviewer_reviews)
        #print reviewer_reviews
        #for x in reviewer_reviews:
         #   print x

        #print len(game_data["reviews"])



        with open('game_data.json', 'w') as outfile:
            json.dump(game_data, outfile)
            outfile.write('\n')
            json.dump(game_data, outfile)

        #rint game_data

        return game_data



    def crawl_page_list(self, url):
        headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'}
        list_html = requests.get(url, headers=headers)
        tree = html.fromstring(list_html.text)


        name = tree.xpath('//div[@class="basic_stat product_title"]/a/text()')
        name = [x.replace('(PS4)','') for x in name]
        name = [x.strip() for x in name]
        scores = tree.xpath('//div[@class="basic_stat product_score brief_metascore"]/div/text()')
        links = tree.xpath('//div[@class="basic_stat product_title"]/a/@href')
        links = ["http://www.metacritic.com" + x for x in links]

        pages = tree.xpath('//li[@class="page last_page"]/a/text()')
        print pages

        if(pages != []):
            pages = pages[0]
            pages = int(pages)
            url = url + '?page='
            for x in xrange(1, pages):
                print url + str(x)
                list_html = requests.get(url + str(x), headers=headers)
                tree = html.fromstring(list_html.text)


                page_name = tree.xpath('//div[@class="basic_stat product_title"]/a/text()')
                page_name = [x.replace('(PS4)','') for x in page_name]
                page_name = [x.strip() for x in page_name]
                name += page_name
                page_scores = tree.xpath('//div[@class="basic_stat product_score brief_metascore"]/div/text()')
                scores += page_scores
                page_links = tree.xpath('//div[@class="basic_stat product_title"]/a/@href')
                page_links = ["http://www.metacritic.com" + x for x in page_links]
                links += page_links

                #print page_name
                #print len(page_name)
                #print scores
                #print len(page_scores)
                #print links
                #print len(page_links)



        print "TOTAL:"
        #print name
        print len(name)
        #print scores
        print len(scores)
        #print links
        print len(links)

        with open('new.json', 'w') as outfile:
            for x in xrange(1,len(name)):
                if scores[x] != 'tbd':
                    json.dump(self.crawl(links[x]), outfile)
                    outfile.write('\n')
                    time.sleep(3)
                    print x, name[x]

        return

print "hello"

crawler = GameCrawler("http://www.metacritic.com/game/pc/okami-hd")
#crawler.crawl("http://www.metacritic.com/game/playstation-4/f1-2015")
crawler.crawl_page_list("http://www.metacritic.com/browse/games/title/ps4/f")

total = 0
filename = "new.json"
with open(filename,'r') as myfile:
    for line in myfile:
        myline = json.loads(line)
        total += len(myline['reviews'])
        #print myline['title'] , len(myline['reviews'])

print total
