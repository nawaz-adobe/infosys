export default function decorate(block){
    import('/scripts/jquery.js').then(($) => {
        console.log('jQuery has been loaded');
        import('/scripts/slick.min.js').then(() => {
            console.log('Slick min js has been loaded');

            const mainElement = document.createElement('main');

            const sectionElement = document.createElement('section');
            sectionElement.classList.add('home-most-popular-wraper');

            const containerDivElement = document.createElement('div');
            containerDivElement.classList.add('container', 'at-element-marker', 'at-element-click-tracking');

            const trackDiv = document.createElement('div');
            trackDiv.classList.add('at-track-click-16533046466222491');

            const headingElement = document.createElement('h2');
            headingElement.textContent = "Most Popular";

            const mostPopularDiv = document.createElement('div');
            mostPopularDiv.classList.add('most-popular-carousel');

            const mostPopularSlickDiv = document.createElement('div');
            
            mostPopularSlickDiv.classList.add('most-popular-slick', 'most-popular-slick-at');

            const prevBtn = document.createElement('button');
            prevBtn.classList.add('slick-prev', 'slick-arrow');
            prevBtn.setAttribute('aria-label', 'Previous');
            prevBtn.textContent = "Previous";

            const slickListDiv = document.createElement('div');
            slickListDiv.classList.add('slick-list', 'draggable');

            const slickTrackDiv = document.createElement('div');

            //create ul
            const ulEle = document.createElement('ul');
            ulEle.classList.add('slick-dots');
            ulEle.setAttribute("role","tablist");

            [...block.children].forEach((row,r)=>{
                const slickItem = createSlickItem(row,r);
                mostPopularSlickDiv.appendChild(slickItem);
            })

            var scriptElement = document.createElement('script');
            var scriptCode = `
            $('.most-popular-slick-at').slick({
                dots: true,
                infinite: true,
                speed: 300,
                slidesToShow: 3,
                slidesToScroll: 1,
                buttons: true,
                arrows: true,
                responsive: [
                    {
                        breakpoint: 1400,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 1,
                            infinite: true,
                            dots: true
                        }
                    },
                    {
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 1,
                            infinite: true,
                            dots: true
                        }
                    },
                    {
                        breakpoint: 992,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 1
                        }
                           },
                    {
                        breakpoint: 767,
                        settings: "unslick",
                    }
                ]
            });`;

            scriptElement.innerHTML = scriptCode;

            document.querySelector(".slider-container").innerHTML='';

            document.querySelector(".slider-container").appendChild(mainElement);

            document.querySelector(".slider-container").classList.add('ikislider', 'aem-GridColumn', 'aem-GridColumn--default--12');

            const outerScriptElement = document.createElement('script');

            // Set the type attribute of the script element
            outerScriptElement.type = 'text/javascript';

            // Set the content of the script element
            outerScriptElement.textContent = `
            $('.popular-card').each(function(index){
                if (index > 0) {
                    $(this).removeClass("popular-main-mobile").addClass("popular-sub-mobile");
                    $(this).children(".temp-mobile").addClass("sub-mobile").removeClass("temp-mobile");
                    console.log("class updated for mobile");
                }
            });
            `;

            mostPopularDiv.appendChild(mostPopularSlickDiv);

            trackDiv.appendChild(headingElement);
            trackDiv.appendChild(mostPopularDiv);
            trackDiv.appendChild(scriptElement);

            mainElement.appendChild(sectionElement);
            sectionElement.appendChild(containerDivElement);
            containerDivElement.appendChild(trackDiv);

            document.querySelector(".ikislider").appendChild(outerScriptElement);

            fixFirstDiv(block.children.length);

            var mainjsScript = document.createElement('script')
            mainjsScript.setAttribute("src","/scripts/main.js");
            mainjsScript.setAttribute('defer',true);
            document.body.appendChild(mainjsScript); 

        }).catch(error=>{
            console.error('Error loading Slick.js:', error);
        })

    }).catch(error => {
        console.error('Error loading jQuery:', error);
    });

}

function createSlickItem(row,r){
    const popularSlickItemDiv = document.createElement('div');
    
    popularSlickItemDiv.classList.add('most-popular-slick-item');

    const popularCardDiv = document.createElement('div');
    popularCardDiv.classList.add('card', 'popular-card');
    

    popularSlickItemDiv.appendChild(popularCardDiv);

    [...row.children].forEach((col,c)=>{
        var cardImageDiv="";
        var imgElement="";
        if(c==0){
            cardImageDiv = document.createElement('div');
            cardImageDiv.classList.add('card-image');

            const anchorElement = document.createElement('a');

            var imgElement = document.createElement('img');
            imgElement.classList.add('card-img-top');
            imgElement.setAttribute('src', col.querySelector('picture').querySelector('img').getAttribute('src'));

            cardImageDiv.appendChild(anchorElement);
            anchorElement.appendChild(imgElement);
            popularCardDiv.appendChild(cardImageDiv);

        } else if(c==1){
            const subMobileDiv = document.createElement('div');
            subMobileDiv.classList.add('sub-mobile');

            const cardBodyDiv = document.createElement('div');
            cardBodyDiv.classList.add('card-body');
            var cardBodyAnchorElement;
            [...col.childNodes].forEach((node,i)=>{
                if(i==1){
                    const h5Element = document.createElement('h5');
                    h5Element.classList.add('card-title');
                    h5Element.textContent = node.textContent.trim();
                    subMobileDiv.appendChild(h5Element);
                }else if(i==3){
                    const h4Element = document.createElement('h4');
                    cardBodyAnchorElement = document.createElement('a');
                    cardBodyAnchorElement.setAttribute("title", node.textContent.trim());
                    cardBodyAnchorElement.textContent = node.textContent.trim();

                    popularCardDiv.querySelector("a").setAttribute("title",node.textContent.trim())
                    popularCardDiv.querySelector("a").querySelector("img").setAttribute("alt",node.textContent.trim())
        
                    h4Element.appendChild(cardBodyAnchorElement);
                    cardBodyDiv.appendChild(h4Element);

                }  else if(i==5){
                    const pElement = document.createElement('p');
                    pElement.textContent = node.textContent.trim();
                    pElement.classList.add('card-text');
                    cardBodyDiv.appendChild(pElement);
                } else if(i==7){
                    const ulElement = document.createElement('ul');
                    const liElement = document.createElement('li');
                    ulElement.appendChild(liElement);
                    liElement.textContent = node.textContent.trim();
                    cardBodyDiv.appendChild(ulElement);
                } else if(i==9){
                    cardBodyDiv.querySelector("h4").querySelector("a").setAttribute("href",node.textContent.trim());
                    const anchorEle = popularCardDiv.querySelector(".card-image").querySelector('a');
                    anchorEle.setAttribute("href",node.textContent.trim());
                }
            })
            subMobileDiv.appendChild(cardBodyDiv);
            popularCardDiv.appendChild(subMobileDiv);
        }
    })
    return popularSlickItemDiv;
}

function fixFirstDiv(blockLength){
    const slickTrackDiv = document.querySelector(".slick-track");
    for(let i=0;i<slickTrackDiv.children.length;i++){
        const child = slickTrackDiv.children[i];

        const slickIndex = child.getAttribute('data-slick-index');
        if(slickIndex==0 || slickIndex==blockLength){
            const cardTitle = child.querySelector(".card-title");
            const cardBody = child.querySelector(".card-body");

            const subMobileDiv = child.querySelector('.sub-mobile');
            if(subMobileDiv){
                subMobileDiv.remove();
            }
            child.querySelector(".popular-card").appendChild(cardTitle);
            child.querySelector(".popular-card").appendChild(cardBody);

            child.querySelector(".popular-card").classList.remove('popular-sub-mobile');
            child.querySelector(".popular-card").classList.add('popular-main-mobile')
        }
    }
}