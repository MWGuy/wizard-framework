<?php

use bundle\aceeditor\AceEditorModule;
use framework\core\Event;
use framework\web\HotDeployer;
use framework\web\WebApplication;
use framework\web\WebUI;
use ui\MainUI;

$deployer = new HotDeployer(function () {
    $webUi = new WebUI();
    $webUi->addModule(new AceEditorModule());
    $webUi->setupResources(
        './../web-ui/src-js/build/lib/dnext-engine.js', './../web-ui/src-js/build/lib/dnext-engine.min.css'
    );

    $app = new WebApplication();
    $app->addModule($webUi);
    $webUi->addUI(MainUI::class);

    $app->launch();
}, function () {
    $app = WebApplication::current();
    $app->trigger(new Event('restart', $app));
    $app->shutdown();
});

$deployer->addDirWatcher('./src-php');
$deployer->addDirWatcher('../web/src-php');
$deployer->addDirWatcher('../web-ui/src-php');
$deployer->run();