/* 	Light/Dark Theme Switcher
    GNOME Shell extension
    (c) Francois Thirioux 2022
    License: GPLv3 	*/


const { Gio, GObject, St } = imports.gi;

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;

var DEFAULT_SCHEME_NAME = 'default';
var LIGHT_SCHEME_NAME = 'prefer-light';
var DARK_SCHEME_NAME = 'prefer-dark';
var LIGHT_SCHEME_ICON = 'weather-clear-symbolic';
var DARK_SCHEME_ICON = 'weather-clear-night-symbolic';


var ThemeIndicator = GObject.registerClass(
class ThemeIndicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, 'Theme Switcher');

        this.hbox = new St.BoxLayout({visible: true, reactive: true, can_focus: true, track_hover: true});
        this.icon = new St.Icon({style_class: 'system-status-icon'});

        this.schema = Gio.Settings.new('org.gnome.desktop.interface');
        switch (this.schema.get_string('color-scheme')) {
            case LIGHT_SCHEME_NAME:
            case DEFAULT_SCHEME_NAME:
                this.icon.icon_name = LIGHT_SCHEME_ICON;
            break;
            case DARK_SCHEME_NAME:
                this.icon.icon_name = DARK_SCHEME_ICON;
            break;
            default:
                Main.notify("Theme switching error.");
        }

        this.hbox.add_child(this.icon);
        this.add_child(this.hbox);
        this.click = this.connect("button-release-event", this._toggle_theme.bind(this));
    }

    _toggle_theme() {
        switch (this.schema.get_string('color-scheme')) {
            case LIGHT_SCHEME_NAME:
            case DEFAULT_SCHEME_NAME:
                this.schema.set_string('color-scheme', DARK_SCHEME_NAME);
                if (!this.schema.get_string('gtk-theme').endsWith("-dark")) {
                    this.schema.set_string('gtk-theme', this.schema.get_string('gtk-theme') + "-dark");
                }
                this.icon.icon_name = DARK_SCHEME_ICON;
            break;
            case DARK_SCHEME_NAME:
                this.schema.set_string('color-scheme', DEFAULT_SCHEME_NAME);
                if (this.schema.get_string('gtk-theme').endsWith("-dark")) {
                    this.schema.set_string('gtk-theme', this.schema.get_string('gtk-theme').slice(0,-5));
                }
                this.icon.icon_name = LIGHT_SCHEME_ICON;
            break;
            default:
                Main.notify("Theme switching error.");
        }
    }
});

class Extension {
    constructor() {
    }

    enable() {
        this._theme_indicator = new ThemeIndicator();
        Main.panel.addToStatusArea('theme-indicator', this._theme_indicator);
    }

    disable() {
        this._theme_indicator.destroy();
    }
}

function init() {
    return new Extension();
}
