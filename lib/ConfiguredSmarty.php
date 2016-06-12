<?php

class ConfiguredSmarty extends Smarty {
	
	public function __construct($path = null) {
		parent::__construct();

		if (is_null($path)) $path = __DIR__ . '/../view';

        $this->setTemplateDir($path . '/templates');
        $this->setCompileDir($path . '/templates_c');
        $this->setConfigDir($path . '/configs');
        $this->setCacheDir($path . '/cache');
        $this->setPluginsDir($path . '/plugins');

	}
}