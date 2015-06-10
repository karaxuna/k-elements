# k-elements
Html5 custom elements

<b> Include JS file: </b>

  `<script type="text/javascript" src="./index.js"></script>`
    
<b> Routing with only html: </b>

    <a href="#!/sector1"> Sector 1 </a> |
    <a href="#!/sector1/sub"> Sector 1 sub </a> |
    <a href="#!/sector2"> Sector 2 </a>
    <br/>
    <k-route when="/sector1">
        Sector 1
        <k-route when="/sub">
            Sub of sector 1
        </k-route>
    </k-route>
    <k-route when="/sector2">
        Sector 2
    </k-route>
