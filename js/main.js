// Initialize full page layout
// Adapted from https://github.com/alvarotrigo/fullPage.js/#fullpagejs

var myFullpage = new fullpage('#fullpage', {
    //Navigation
    menu: '#menu',
    lockAnchors: false,
    anchors:['Home', 'Introduction', 'Historical_Context', 'Decade_Visualization', 'Exploring_SEAS'],
    navigation: true,
    navigationPosition: 'right',
    navigationTooltips: ['Home', 'TEST'],
    showActiveTooltip: false,
    slidesNavigation: true,
    slidesNavPosition: 'bottom',

    //Scrolling
    css3: true,
    scrollingSpeed: 700,
    autoScrolling: true,
    fitToSection: true,
    fitToSectionDelay: 1000,
    scrollBar: false,
    easing: 'easeInOutCubic',
    easingcss3: 'ease',
    loopBottom: false,
    loopTop: false,
    loopHorizontal: true,
    continuousVertical: false,
    continuousHorizontal: false,
    scrollHorizontally: false,
    interlockedSlides: false,
    dragAndMove: false,
    offsetSections: false,
    resetSliders: false,
    fadingEffect: false,
    normalScrollElements: '#element1, .element2',
    scrollOverflow: false,
    scrollOverflowReset: false,
    scrollOverflowOptions: null,
    touchSensitivity: 15,
    bigSectionsDestination: null,

    //Accessibility
    keyboardScrolling: true,
    animateAnchor: true,
    recordHistory: true,

    //Design
    controlArrows: true,
    verticalCentered: true,
    sectionsColor : ['#FFFFFF', '#8b0000', '#FFD5D3', '#FFFFFF', '#FFD5D3', '#FFFFFF', '#8b0000', '#FFD5D3', '#8b0000', '#FFD5D3',
        '#FFFFFF', '#FFD5D3', '#8b0000'],
    paddingTop: '3em',
    paddingBottom: '10px',
    fixedElements: '#header, .footer',
    responsiveWidth: 0,
    responsiveHeight: 0,
    responsiveSlides: false,
    parallax: false,
    parallaxOptions: {type: 'reveal', percentage: 62, property: 'translate'},
    cards: false,
    cardsOptions: {perspective: 100, fadeContent: true, fadeBackground: true},

    //Custom selectors
    sectionSelector: '.section',
    slideSelector: '.slide',

    lazyLoading: true,

    //events
    onLeave: function(origin, destination, direction){},
    afterLoad: function(origin, destination, direction){},
    afterRender: function(){},
    afterResize: function(width, height){},
    afterReBuild: function(){},
    afterResponsive: function(isResponsive){},
    afterSlideLoad: function(section, origin, destination, direction){},
    onSlideLeave: function(section, origin, destination, direction){}
});

//methods
fullpage_api.setAllowScrolling(true);
