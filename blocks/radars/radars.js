export default function decorate(block){
    
    // Create section-1 

    // Create div element with class "interests-main"
    const interestsMain = document.createElement('div');
    interestsMain.classList.add('interests-main');

    // Create div element with class "row" and "no-gutters"
    const row1 = document.createElement('div');
    row1.classList.add('row', 'no-gutters');

    // Create div element with class "row" and "no-gutters"
    const row2 = document.createElement('div');
    row2.classList.add('row', 'no-gutters', 'mt-sm-3');

    interestsMain.appendChild(row1);
    interestsMain.appendChild(row2);

    const firstChildDiv = document.createElement('div');
    firstChildDiv.classList.add('col-lg-6', 'pr-0')

    const newRow1 = document.createElement('div');
    newRow1.classList.add('row', 'no-gutters');

    firstChildDiv.appendChild(newRow1);

    const interestHiddenDiv = document.createElement('div');
    interestHiddenDiv.classList.add('col-lg-6', 'col-md-6', 'interest-hidden', 'pr-sm-3');

    firstChildDiv.appendChild(newRow1);
    newRow1.appendChild(interestHiddenDiv);

    //section-2 ul
    const accordionList = document.createElement('ul');
    accordionList.classList.add('accordion-list');

    const section2Heading = document.createElement('h2');

    [...block.children].forEach((row,index)=>{
        if(index==0){
            const firstImgDiv = document.createElement('div');
            firstImgDiv.classList.add('col-lg-6', 'mb-15', 'pr-0', 'pr-lg-3')
            
            const mobileDiv = document.createElement('div');
            mobileDiv.classList.add('find-more-mobile');

            // Create insights wrapper div with classes "insights-wraper", "home-overlay", and "insights-hover"
            const insightsWrapper1 = document.createElement('div');
            insightsWrapper1.classList.add('insights-wraper', 'home-overlay', 'insights-hover');
            insightsWrapper1.style.height = '282.45px';

            [...row.children].forEach((col,c)=>{
                if(c==0){
                    const imgElement = document.createElement('img');
                    imgElement.setAttribute('src', col.querySelector('img').getAttribute('src'));
                    imgElement.classList.add('img-fluid', 'insights-image');
                    insightsWrapper1.appendChild(imgElement);
                } else if (c==1){
                    const insightsDiv = createInsightsDiv(col, 'insights', 'icon-long-right-arrow', 'find-more-white', 'icon-chevron-right-circle-white', 'icon-long-right-arrow',index,insightsWrapper1)
                    insightsWrapper1.appendChild(insightsDiv);
                }
            })

            row1.appendChild(firstImgDiv);
            row1.appendChild(firstChildDiv);
            firstImgDiv.appendChild(insightsWrapper1);
            firstImgDiv.appendChild(mobileDiv);

        } else if (index==1){
            const firstImgDiv = document.createElement('div');
            firstImgDiv.classList.add('article-wraper', 'insights-hover', 'modernization', 'mb-sm-3');
            firstImgDiv.style.height = '141.225px';

            const mobileDiv = document.createElement("div");
            mobileDiv.classList.add("find-more-mobile");

            [...row.children].forEach((col,c)=>{
                
                if(c==0){
                    const firstImg = document.createElement('img');
                    firstImg.setAttribute('src', col.querySelector('picture').querySelector('img').getAttribute('src'));
                    firstImg.classList.add('img-fluid', 'interactive-image');
                    firstImg.setAttribute('alt', 'Video');
                    firstImgDiv.appendChild(firstImg);

                } else if(c==1){
                    const insightsDiv = createInsightsDiv(col, 'insights', "icon-long-right-arrow", "find-more-white", "icon-chevron-right-circle-white", "icon-long-right-arrow",index,firstImgDiv)
                    firstImgDiv.appendChild(insightsDiv);

                } 
            })

            interestHiddenDiv.appendChild(firstImgDiv);
            interestHiddenDiv.appendChild(mobileDiv);  

        } else if (index==2){
            const secondImgDiv = document.createElement('div');
            secondImgDiv.classList.add('interactive-wraper', 'home-overlay', 'insights-hover');
            secondImgDiv.style.height = '141.225px';

            const mobileDiv = document.createElement("div");
            mobileDiv.classList.add("find-more-mobile");

            [...row.children].forEach((col,c)=>{
                
                if(c==0){
                    const secondImg = document.createElement('img');
                    secondImg.setAttribute('src', col.querySelector('picture').querySelector('img').getAttribute('src'));
                    secondImg.classList.add('img-fluid', 'interactive-image');
                    secondImg.setAttribute('alt', 'Video');
                    secondImgDiv.appendChild(secondImg);

                } else if(c==1){
                    const insightsDiv = createInsightsDiv(col, 'insights', "icon-long-right-arrow", "find-more-white", "icon-chevron-right-circle-white", "icon-long-right-arrow",index,secondImgDiv)
                    secondImgDiv.appendChild(insightsDiv);
                } 
            })

            interestHiddenDiv.appendChild(secondImgDiv);
            interestHiddenDiv.appendChild(mobileDiv); 

        } else if (index==3){
            const columnDiv = document.createElement('div');
            columnDiv.classList.add('col-lg-6', 'col-md-6', 'interest-hidden', 'pr-0');

            const podcastWrapperDiv = document.createElement('div');
            podcastWrapperDiv.classList.add('podcast-wraper', 'home-overlay', 'insights-hover');
            podcastWrapperDiv.style.height = '282.45px';
            
            const mobileDiv = document.createElement("div");
            mobileDiv.classList.add("find-more-mobile");

            columnDiv.appendChild(podcastWrapperDiv);

            [...row.children].forEach((col,c)=>{
                if(c==0){
                    const imgElement = document.createElement('img');
                    imgElement.setAttribute('src', col.querySelector('picture').querySelector('img').getAttribute('src'));
                    imgElement.classList.add('img-fluid', 'podcast-image');
                    podcastWrapperDiv.appendChild(imgElement);
                } else if(c==1){
                    const insightsDiv = createInsightsDiv(col, 'insights', 'icon-long-right-arrow', 'find-more-white', 'icon-chevron-right-circle-white', 'icon-long-right-arrow',index,podcastWrapperDiv)
                    podcastWrapperDiv.appendChild(insightsDiv);
                }
            })
            columnDiv.appendChild(mobileDiv);
            newRow1.appendChild(columnDiv);
        } else if (index==4){
            const columnDiv = document.createElement('div');
            columnDiv.classList.add('col-lg-6', 'col-md-6', 'interest-hidden', 'pr-sm-3');

            const caseStudyWrapperDiv = document.createElement('div');
            caseStudyWrapperDiv.classList.add('case-study-wraper', 'insights-hover');
            caseStudyWrapperDiv.style.height = '100%';

            const mobileDiv = document.createElement("div");
            mobileDiv.classList.add("find-more-mobile");

            columnDiv.appendChild(caseStudyWrapperDiv);

            [...row.children].forEach((col,c)=>{
                if(c==0){
                    const imgElement = document.createElement('img');
                    imgElement.setAttribute('src', col.querySelector('picture').querySelector('img').getAttribute('src'));
                    imgElement.classList.add('img-fluid', 'case-study-image');
                    caseStudyWrapperDiv.appendChild(imgElement);
                } else if(c==1){
                    const insightsDiv = createInsightsDiv(col, 'case-study-content', 'icon-long-right-arrow', 'find-more-white', 'icon-chevron-right-circle-white', 'icon-long-right-arrow', index, caseStudyWrapperDiv);
                    caseStudyWrapperDiv.appendChild(insightsDiv);
                }
            })
            columnDiv.appendChild(mobileDiv);
            row2.appendChild(columnDiv);
        } else if (index==5){
            const columnDiv = document.createElement('div');
            columnDiv.classList.add('col-lg-6', 'col-md-6', 'interest-hidden', 'pr-0');

            const qualityEngDiv = document.createElement('div');
            qualityEngDiv.classList.add('quality-engg', 'insights-hover');

            const mobileDiv = document.createElement("div");
            mobileDiv.classList.add("find-more-mobile");

            columnDiv.appendChild(qualityEngDiv);

            [...row.children].forEach((col,c)=>{
                if(c==0){
                    const imgElement = document.createElement('img');
                    imgElement.setAttribute('src', col.querySelector('picture').querySelector('img').getAttribute('src'));
                    imgElement.classList.add('img-fluid', 'quality-image');
                    qualityEngDiv.appendChild(imgElement);
                } else if(c==1){
                    const insightsDiv = createInsightsDiv(col, 'quality-content', 'icon-long-right-arrow', 'find-more-white', 'icon-chevron-right-circle-white', 'icon-long-right-arrow', index, qualityEngDiv)
                    qualityEngDiv.appendChild(insightsDiv);
                }
            })
            columnDiv.appendChild(mobileDiv);
            row2.appendChild(columnDiv);
        } else if (index==6){
            section2Heading.textContent = row.textContent.trim();
        }
        else {
            const liElement = document.createElement('li');
            liElement.classList.add("enterprises", "home-overlay");

            [...row.children].forEach((col,c)=>{
                if (c === 0) { // First column contains image
                    const imgElement = document.createElement('img');
                    imgElement.setAttribute('src', col.querySelector('img').getAttribute('src'));
                    imgElement.setAttribute('alt', 'Sustainability');
                    imgElement.classList.add('img-fluid', 'theme-image');
                    liElement.appendChild(imgElement);

                } else if (c === 1) {
                    const divElement = document.createElement('div');
                    const firstDivElement = document.createElement('div');
                    divElement.classList.add('section-content');
                    firstDivElement.classList.add('section-title');

                    const anchorEle = document.createElement('a');
                    anchorEle.classList.add('details-link');

                    const spanEle = document.createElement('span');
                    spanEle.classList.add('icon-long-right-arrow');

                    anchorEle.appendChild(spanEle);

                    [...col.children].forEach((node,i)=>{
                        if(i==0){
                            const h3Element = document.createElement('h3');
                            const h4Element = document.createElement('h4');
                            h3Element.textContent = node.textContent.trim();
                            h4Element.textContent = node.textContent.trim();
                            divElement.appendChild(h3Element);
                            firstDivElement.appendChild(h4Element);
                        } else if(i==1){
                            const pElement = document.createElement('p');
                            pElement.textContent = node.textContent.trim();
                            anchorEle.setAttribute('title',node.textContent.trim());
                            divElement.appendChild(pElement);
                            divElement.appendChild(anchorEle);
                        } else if(i==2){
                            anchorEle.setAttribute('href',node.textContent.trim());
                        }
                        liElement.appendChild(firstDivElement);
                        liElement.appendChild(divElement);
                    })
                }
            })
            accordionList.appendChild(liElement);
        }
    })

    var section1 = document.createElement('section');
    section1.classList.add('home-interests-wraper');
    section1.appendChild(interestsMain);

    var outerDiv = document.createElement('div');
    outerDiv.classList.add('freeflowhtml', 'aem-GridColumn', 'aem-GridColumn--default--12');

    var mainElement = document.createElement('main');
    mainElement.classList.add('home-page-wraper');

    // var sectionElement = document.createElement('section');
    // sectionElement.classList.add('home-interests-wraper');

    outerDiv.appendChild(mainElement);
    mainElement.appendChild(section1);
    // sectionElement.appendChild(interestsMain);

    var parent = document.querySelector('main');
    var oldDiv = document.querySelector('.radars-container');
    parent.replaceChild(outerDiv, oldDiv); 

    // Section-2
    const section2 = document.createElement('section');
    section2.classList.add('home-reseacher-themes-wraper');

    const section2Container = document.createElement('div');
    section2Container.classList.add('container');
    
    section2.appendChild(section2Container);
    section2Container.appendChild(section2Heading);

    const section2Wrapper = document.createElement('div');
    section2Wrapper.classList.add('accordion-wraper');

    section2Container.appendChild(section2Wrapper);
    section2Wrapper.appendChild(accordionList);

    mainElement.appendChild(section2);

    let counter = 0;
    let activeInterval;

    
    let accordion = document.querySelectorAll('.accordion-list');
    let accordList = document.querySelectorAll('.accordion-list li');
    let accordionTitle = document.querySelectorAll('.accordion-list li .section-title');

        console.log("Inside DOM Content Loaded");
        // Select the first li element in the accordion
        const firstAccordionItem = document.querySelector('.accordion-list li:first-child');
    
        // Add the 'active' class to the first accordion item
        firstAccordionItem.classList.add('active');
    
    function toggleAccordion(){
        // Remove 'active' class from all accordion items
        accordList.forEach(item => item.classList.remove('active'));
        // Add 'active' class to the clicked accordion item
        this.classList.add('active');
        // Clear any existing interval
        clearInterval(activeInterval);
        // Start a new interval after 3000 milliseconds
        activeInterval = setInterval(activeAccordion, 5000);
    }

    // Attach click event listener to each accordion item
    accordList.forEach(item => item.addEventListener('click', toggleAccordion));

    // Start the initial interval after 3000 milliseconds
    setTimeout(() => {
        activeInterval = setInterval(activeAccordion, 5000);
    }, 3000);

    function activeAccordion(){
         // Remove 'active' class from all accordion items
        accordList.forEach(item => item.classList.remove('active'));
    
        // Add 'active' class to the current accordion item
        accordList[counter].classList.add('active');
    
        // Increment counter and reset if it exceeds the length of accordList
        counter++;
        if (counter === accordList.length) {
            counter = 0;
        }
    }

    
}


function createInsightsDiv(col, outerDivClass, firstSpanClass, anchorSpan1Class, anchorSpan2Class, anchorSpan3Class, index, wraperDiv){
    
    const insightsDiv = document.createElement('div');
    insightsDiv.classList.add(outerDivClass);

    const insightsh3 = document.createElement('h3');
    insightsh3.classList.add('interest-heading');

    const insightsHeadingAnchor = document.createElement('a');

    const insightsAnchor = document.createElement('a');
    insightsAnchor.classList.add('find-more-desktop');

    insightsDiv.appendChild(insightsh3);
    insightsDiv.appendChild(insightsAnchor);
    insightsh3.appendChild(insightsHeadingAnchor);

    [...col.childNodes].forEach((node,i)=>{
        if(i==1){
            insightsHeadingAnchor.title = node.textContent.trim();
            insightsHeadingAnchor.textContent = node.textContent.trim();
            // insightsAnchor.classList.add('find-more-desktop');

            const insightsAnchorSpan1 = document.createElement('span');
            insightsAnchorSpan1.classList.add(firstSpanClass);

            insightsHeadingAnchor.appendChild(insightsAnchorSpan1);
        } else if(i==3){
            insightsAnchor.title = node.textContent.trim();

            const insightsAnchorSpan1 = document.createElement('span');
            insightsAnchorSpan1.classList.add(anchorSpan1Class);

            const insightsAnchorSpan2 = document.createElement('span');
            insightsAnchorSpan2.classList.add(anchorSpan2Class);

            const insightsAnchorSpan3 = document.createElement('span');
            insightsAnchorSpan3.classList.add(anchorSpan3Class);

            insightsAnchorSpan1.appendChild(insightsAnchorSpan2);
            insightsAnchorSpan1.appendChild(document.createTextNode(node.textContent.trim()));

            insightsAnchor.appendChild(insightsAnchorSpan1);
            insightsAnchor.appendChild(insightsAnchorSpan3);

            if(index!==1 && index!==3){
                const imgElement = wraperDiv.querySelector('img');
                imgElement.setAttribute("alt",node.textContent.trim());
            }

        } else if(i==5){
            insightsHeadingAnchor.setAttribute("href",node.textContent.trim());
        } else if(i==7){
            insightsAnchor.setAttribute("href",node.textContent.trim());
        }

    })

    return insightsDiv;
}