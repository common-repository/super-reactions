"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

document.addEventListener('DOMContentLoaded', function (event) {
  var nonce = document.getElementById('_wpnonce');
  var $tabs = document.querySelectorAll('.srea-tab');
  $tabs.forEach(function (element) {
    element.addEventListener('click', tabActivate);
  });

  function tabActivate(e) {
    document.querySelector('.srea-tab.active').classList.remove('active');
    e.currentTarget.classList.add('active');
    showView(e.currentTarget.dataset.view);
  }

  function showView(id) {
    document.querySelector('.srea-view.active').classList.remove('active');
    document.querySelector("#".concat(id)).classList.add('active');
  }

  function showLoader() {
    var loader = document.createElement('div');
    loader.className = 'srea-loader';
    return loader;
  }

  function showResults(status, text) {
    var badge = document.createElement('div');
    badge.className = status ? 'srea-result-badge srea-badge-success' : 'srea-result-badge srea-badge-error';
    badge.textContent = text;
    return badge;
  }

  var sreaModal = /*#__PURE__*/function () {
    function sreaModal() {
      var _this = this;

      _classCallCheck(this, sreaModal);

      this.modal = document.querySelector('#srea-settings-modal');
      this.selectingOption = '';
      this.modalFor = '';
      var $settingInitiators = document.querySelectorAll('[data-srea-option]');
      $settingInitiators.forEach(function (element) {
        element.addEventListener('click', _this.open.bind(_this));
      });
      var $removers = document.querySelectorAll('.srea-remover');
      $removers.forEach(function (element) {
        element.addEventListener('click', _this.remove.bind(_this));
      });
      var $previews = this.modal.querySelectorAll('.srea-setting-preview');
      $previews.forEach(function (element) {
        element.addEventListener('click', _this.select.bind(_this));
      });
      var $closeBtn = document.querySelector('#srea-modal-close-btn');
      $closeBtn.addEventListener('click', this.close.bind(this));
    }

    _createClass(sreaModal, [{
      key: "open",
      value: function open(e) {
        var optionName = e.currentTarget.dataset.sreaOption;
        this.selectingOption = optionName;
        this.modalFor = e.currentTarget;
        this.addTitle(optionName);
        this.modal.classList.add('visible');
        this.calculatePosition();
        window.addEventListener('resize', this.calculatePosition);
      }
    }, {
      key: "capitalize",
      value: function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      }
    }, {
      key: "addTitle",
      value: function addTitle(slug) {
        var $title = document.getElementById('srea-modal-title-option-name');
        $title.insertAdjacentText('beforeend', this.capitalize(slug));
      }
    }, {
      key: "close",
      value: function close() {
        this.modal.classList.remove('visible');
        var $title = document.getElementById('srea-modal-title-option-name');
        this.empty($title);
        this.selectingOption = null;
        this.modalFor = null;
      }
    }, {
      key: "calculatePosition",
      value: function calculatePosition() {
        var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        var vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        this.modal.style.left = "".concat((vw + document.getElementById('adminmenuwrap').offsetWidth - this.modal.offsetWidth) / 2, "px");
        this.modal.style.top = "".concat((vh - this.modal.offsetHeight) / 2, "px");
      }
    }, {
      key: "select",
      value: function select(event) {
        var $selectedPreview = event.currentTarget.cloneNode(true);
        var $previewWrapper = this.modalFor.closest('.srea-template-selector').querySelector('.srea-selected-template-preview');
        this.empty($previewWrapper);
        $previewWrapper.insertAdjacentElement('beforeend', $selectedPreview);
        this.modalFor.innerText = 'Change';
        this.enableBtn(this.modalFor.parentNode.querySelector('.srea-remover'));
        this.saveSettings(event);
      }
    }, {
      key: "saveSettings",
      value: function saveSettings(event) {
        var spinner = showLoader();
        var view = document.querySelector('.srea-view.active');
        view.insertAdjacentElement('afterBegin', spinner);
        var formData = new FormData();
        formData.append('action', 'srea_save_settings');
        formData.append('nonce', nonce.value);
        formData.append('option', this.selectingOption);
        formData.append('value', event.currentTarget.dataset.slug);
        this.close();
        fetch(ajaxurl, {
          method: 'POST',
          body: formData
        }).then(function (response) {
          return response.json();
        }).then(function (res) {
          view.removeChild(spinner);
          var badge = showResults(res.success, res.data.results);
          view.insertAdjacentElement('afterBegin', badge);
          setTimeout(function () {
            view.removeChild(badge);
          }, 500);
        });
      }
    }, {
      key: "remove",
      value: function remove(event) {
        var $previewWrapper = event.currentTarget.closest('.srea-template-selector').querySelector('.srea-selected-template-preview');
        this.empty($previewWrapper);
        this.disableBtn(event.currentTarget);
        var spinner = showLoader();
        var view = document.querySelector('.srea-view.active');
        view.insertAdjacentElement('afterBegin', spinner);
        var formData = new FormData();
        formData.append('action', 'srea_save_settings');
        formData.append('nonce', nonce.value);
        formData.append('option', event.currentTarget.dataset.sreaOption);
        formData.append('value', '');
        this.close();
        fetch(ajaxurl, {
          method: 'POST',
          body: formData
        }).then(function (response) {
          return response.json();
        }).then(function (res) {
          view.removeChild(spinner);
          var badge = showResults(res.success, res.data.results);
          view.insertAdjacentElement('afterBegin', badge);
          setTimeout(function () {
            view.removeChild(badge);
          }, 500);
        });
      }
    }, {
      key: "disableBtn",
      value: function disableBtn(btn) {
        btn.setAttribute('disabled', 'disabled');
      }
    }, {
      key: "enableBtn",
      value: function enableBtn(btn) {
        btn.removeAttribute('disabled');
      }
    }, {
      key: "empty",
      value: function empty(ele) {
        ele.innerHTML = null;
      }
    }]);

    return sreaModal;
  }();

  new sreaModal();
});