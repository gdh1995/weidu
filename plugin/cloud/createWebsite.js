var createWebsite = {
	suggestHide : true,
	trends : [],
	defaultLogoUrl : 'img/skin_0/ie_logo.png',
	url : '',
	title : '',
	LogoUrl : '',
	isUpdate : false,
	container : '',
	init : function () {
		var self = this;
		chrome.history.search({
			text : '',
			maxResults : 5000,
			startTime : 0
		}, function (data) {
			if (data instanceof Array && data.length > 0) {
				$.each(data, function (i, n) {
					if (n.url && n.url.substring(0, 4) === 'http') {
						try {
							var _domain = n.url.match(/[^:]+:\/\/([^\/]+)/);
							var domain = _domain[1];
							if (domain) {
								if (self.trends.indexOf(domain) == -1) {
									self.trends.push(domain)
								}
							}
						} catch (error) {}

					}
				})
			}
		});
		$('#cloudDialog').bind("click", function (e) {
			if (!isContainsClass(e.target, "selectArrow") && !isContainsClass(e.target, "logoContainer")) {
				if (self.container.find('.logoBox').hasClass("selected")) {
					self.container.find('.logoBox').removeClass("selected");
					self.container.find('.logoContainer').hide()
				}
			}
		});
		self.container.find('.selectArrow').unbind('click').bind('click', function () {
			if (!self.container.find('.logoBox').hasClass("selected")) {
				self.container.find('.logoBox').addClass("selected");
				self.container.find('.logoContainer').show()
			} else {
				self.container.find('.logoBox').removeClass("selected");
				self.container.find('.logoContainer').hide()
			}
		});
		self.container.find("#logoData").bind('change', function () {
			var file = this.files[0];
			if (file.size >= 30 * 1024) {
				showNotice(getI18nMsg('logoFileLarger'));
				return
			}
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function (e) {
				$.post(urlImg + "weidu/uploadLogo.php", {
					"imgData" : this.result
				}, function (result) {
					if (!result || result.substring(0, 5) === 'ERROR') {
						showNotice(getI18nMsg('logoFileUploadError'));
						return
					}
					self.container.find('#webSiteLogo').val(urlImg + result);
					self.loadLogo(urlImg + result);
					self.container.find('.logoBox').removeClass("selected");
					self.container.find('.logoContainer').hide()
				})
			};
			$(this).val('');
			this.files = null
		});
		self.container.find('#resetBtn').bind("click", function () {
			$('#cloudDialog').find('.close').get(0).click();
			return false
		});
		self.container.find('#webSiteTitle').bind('focus', function () {
			this.select();
		});
		self.container.find('#webSiteUrl').bind('blur', function () {
			if (self.suggestHide) {
				self.container.find('#webSiteUrlSuggest').hide()
			} else {
				return false
			}
			if ($(this).val() == $(this).attr("v")) {
				return false
			}
			if ($(this).val().trim() == "" || $(this).val().trim() == "http://") {
				$(this).siblings('.message').html('<div class="checkError"></div>' + getI18nMsg('webSiteUrlNull'));
				return false
			} else {
				$(this).siblings('.message').html('<div class="checkOK"></div>' + getI18nMsg('webSiteUrlNoError'))
			}
			var img = self.container.find('#webSiteLogo').val();
			if (img && img !== self.defaultLogoUrl &&
				!(img.lastIndexOf(urlImg, 0) === 0 && img.indexOf("/m/") > 0)) {
				return;
			}
			var img = $(this).val();
			if (! /^(?:(?:https|http|ftp|rtsp|mms):\/\/)?[-0-9A-Z_a-z]+\.[^\.]/.test(img)) {
				img = self.defaultLogoUrl
			} else {
				img = img.toLowerCase().replace(/%3a%2f%2f/ig, '://');
				var imgMatch = img.match(/:\/\/[^\/]+/g);
				if (imgMatch == null) {
					img = "http://" + img;
					imgMatch = img.match(/:\/\/[^\/]+/g)
				}
				img = imgMatch.pop();
				img = img.substring(3);
				img = img.replace(/^www\./, '');
				if (img == '' || img.indexOf('.') == -1 || img.indexOf('.') == img.length - 1) {
					img = self.defaultLogoUrl
				} else {
					if (self.container.find('#webSiteTitle').val() == "") {
						self.container.find('#webSiteTitle').val(img)
					}
					img = urlImg + 'm/' + img + '.png'
				}
			}
			self.logoUrl = img;
			self.container.find('#webSiteLogo').val(img);
			self.loadLogo(img);
			$(this).attr("v", $(this).val())
		});
		self.container.find('#webSiteTitle').bind('blur', function () {
			if ($(this).val() == $(this).attr("v")) {
				return false
			}
			if ($(this).val() == '') {
				$(this).siblings('.message').html('<div class="checkError"></div>' + getI18nMsg('webSiteTitleNull'));
				return false
			} else {
				$(this).siblings('.message').html('<div class="checkOK"></div>' + getI18nMsg('webSiteTitleNoError'))
			}
			$(this).attr("v", $(this).val())
		});
		self.container.find('#websiteForm').bind('submit', function () {
			if (self.container.find('#webSiteUrlSuggest').css('display') != 'none') {
				return false
			}
			if (self.container.find('#webSiteUrl').val().trim() == "" || self.container.find('#webSiteUrl').val().trim() == "http://") {
				self.container.find('#webSiteUrl').siblings('.message').html('<div class="checkError"></div>' + getI18nMsg('webSiteUrlNull'));
				return false
			} else {
				self.container.find('#webSiteUrl').siblings('.message').html('<div class="checkOK"></div>' + getI18nMsg('webSiteUrlNoError'))
			}
			if (self.container.find('#webSiteTitle').val() == '') {
				self.container.find('#webSiteTitle').siblings('.message').html('<div class="checkError"></div>' + getI18nMsg('webSiteTitleNull'));
				return false
			} else {
				self.container.find('#webSiteTitle').siblings('.message').html('<div class="checkOK"></div>' + getI18nMsg('webSiteTitleNoError'))
			}
			if (self.isUpdate != false && self.container.find('#webSiteClassification').val() == cId) {
				var updateOptions = self.isUpdate.split("_");
				if (updateOptions.length > 1) {
					var sum = 0,
					index = 0;
					PDI.updateDialbox(updateOptions[0], updateOptions[2], {
						title : self.container.find('#webSiteTitle').val(),
						url : self.container.find('#webSiteUrl').val(),
						img : self.container.find('#webSiteLogo').val(),
						isNew : true
					});
					oauth.updateMsgId();
					oauth.synchronize()
				}
				_isRefresh = "curPage"
			} else {
				var valWC1 = self.container.find('#webSiteClassification').val();
				if (valWC1 != cId) {
					storage.setId(valWC1);
				}
				if (DBOX.getLastDialbox() == "cloud") {
					PDI.appendDialbox('normal', DBOX.getDialboxIndex('normal', 'cloud'), {
						title : self.container.find('#webSiteTitle').val(),
						url : self.container.find('#webSiteUrl').val(),
						img : self.container.find('#webSiteLogo').val(),
						isApp : false,
						isNew : true
					})
				} else {
					PDI.insertDialbox('normal', {
						title : self.container.find('#webSiteTitle').val(),
						url : self.container.find('#webSiteUrl').val(),
						img : self.container.find('#webSiteLogo').val(),
						isApp : false,
						isNew : true
					})
				}
				if (valWC1 != cId) {
					storage.setId(cId);
					_isRefresh = "remove"
				} else {
					_isRefresh = "lastPage"
				}
			}
			$('#cloudDialog').find('.close').get(0).click();
			return false
		});
		self.initLogoContainer();
		self.initClassificationsContainer();
		self.initSuggest()
	},
	loadLogo : function (logoUrl) {
		var logo = this.container.find('.logoBox .logo')
		var logoImg = new Image();
		logoImg.onload = function () {
			logo.css({
				backgroundSize: (150 / 90) < (logoImg.width / logoImg.height)
					? '100% auto' : 'auto 100%',
				'backgroundImage' : 'url(' + logoUrl + ')'
			})
		};
		logoImg.src = logoUrl
	},
	initWebsite : function (url, title, logoUrl, type, id) {
		var self = this;
		self.url = url || "";
		self.title = title || "";
		self.logoUrl = logoUrl || self.defaultLogoUrl;
		type = typeof type == "undefined" ? '' : type;
		id = typeof id == "undefined" ? '' : id;
		if (type != '' && id != '') {
			self.isUpdate = type + "_" + id
		} else {
			self.isUpdate = false
		}
		if (type == "quick") {
			if (self.logoUrl.indexOf(urlImg) == 0 && self.logoUrl.indexOf('/s/') > -1) {
				self.logoUrl = self.logoUrl.replace("/s/", "/m/")
			}
		}
		self.container.find('#webSiteLogo').val(self.logoUrl);
		self.loadLogo(self.logoUrl);
		self.container.find('#webSiteUrl').val(self.url).attr("v", self.url).siblings('.message').html(getI18nMsg('webSiteUrlMessage'));
		self.container.find('#webSiteTitle').val(self.title).attr("v", self.title).siblings('.message').html(getI18nMsg('webSiteTitleMessage'));
		self.container.find('.logoBox').removeClass("selected");
		self.initLogoContainer();
		self.container.find('.logoContainer').hide()
	},
	initClassificationsContainer : function () {
		var self = this;
		var classificationsListHtml = '<div class="classification' + (cId == "" ? " selected" : "") + '" cId=""><div class="classificationSelected"></div><img src="plugin/classification/img/logo.png"><br/><span>' + getI18nMsg('classificationMain') + '</span></div>';
		$.each(PDI.get("classifications"), function (i, n) {
			if (typeof n.dataUrl != "undefined" && n.dataUrl != "") {
				if (typeof n.LTime != "undefined" && n.LTime > 0) {
					classificationsListHtml += '<div class="classification' + (cId == n.id ? " selected" : "") + '" cId="' + n.id + '"><div class="classificationSelected"></div><img src="' + n.logo + '"><br/><span>' + n.title + '</span></div>'
				}
			} else {
				classificationsListHtml += '<div class="classification' + (cId == n.id ? " selected" : "") + '" cId="' + n.id + '"><div class="classificationSelected"></div><img src="' + n.logo + '"><br/><span>' + n.title + '</span></div>'
			}
		});
		classificationsListHtml += '<input type="hidden" id="webSiteClassification" value="' + cId + '">';
		self.container.find(".classificationsList").html(classificationsListHtml);
		self.container.find(".classificationsContainer .classification").unbind('click').bind('click', function () {
			self.container.find(".classificationsContainer .classification").removeClass("selected");
			$(this).addClass("selected");
			self.container.find("#webSiteClassification").val($(this).attr("cId"))
		})
	},
	initLogoContainer : function () {
		var self = this, iStart = ui_locale != 'zh_CN' ? 3000 : 0, logoC = self.container.find('.logoContainer');
		logoC.children().not('#logoData').remove();
		logoC.append('<div class="logoItemTitle">' + getI18nMsg('webSiteLogoUpload') + '</div>');
		logoC.append($('<div class="logoLine"></div><div class="logoItem" style="background-image:url(' + urlImg + 'cloudapp/images/' + _langPre + '_uploadLogo.png)"></div>').bind("click", function () {
				self.container.find('#logoData').get(0).click();
				return false
			}));
		logoC.append('<div class="logoItemTitle">' + getI18nMsg('webSiteLogoOutside') + '</div>');
		logoC.append($('<div class="logoLine"></div><div class="logoItem" style="background-image:url(' + urlImg + 'cloudapp/images/' + _langPre + '_outSideLogo.png)"></div>').bind("click", function () {
				var old = self.container.find('#webSiteLogo').val()
				var logoUrl = prompt(getI18nMsg('webSiteLogoOutsideUrl'), old);
				if (logoUrl != null && logoUrl != "" && logoUrl != old) {
					self.container.find('#webSiteLogo').val(logoUrl);
					self.loadLogo(logoUrl);
					self.container.find('.logoBox').removeClass("selected");
					self.container.find('.logoContainer').hide()
				}
				return false
			}));
		logoC.append('<div class="logoItemTitle">' + getI18nMsg('webSiteLogos') + '</div>');
		for (var i = iStart + 1; i <= iStart + 30; i++) {
			logoC.append($(
				'<div class="logoLine"></div><div class="logoItem" style="background-image:url('
				+ urlImg + 'cloudapp/generalLogo/m/' + self.pad(i, 4) + '.png)"></div>'
			).bind("click", function () {
					var selectedLogo = $(this).css("backgroundImage");
					var selectedLogoSize = $(this).css("backgroundSize");
					self.container.find('#webSiteLogo').val(selectedLogo.replace('url(', '').replace(')', '').replace(/\"/g, ""));
					$(this).css({
						"backgroundImage" : self.container.find('.logoBox .logo').css("backgroundImage"),
						"backgroundSize" : self.container.find('.logoBox .logo').css("backgroundSize")
					});
					self.container.find('.logoBox .logo').css({
						"backgroundImage" : selectedLogo,
						"backgroundSize" : selectedLogoSize
					});
					self.container.find('.logoBox').removeClass("selected");
					self.container.find('.logoContainer').hide()
				}))
		}
	},
	initSuggest : function () {
		var self = this;
		self.container.find('#webSiteUrlSuggest').unbind("mouseover").bind("mouseover", function (e) {
			if (!isMouseMoveContains(e, this)) {
				self.suggestHide = false
			}
		}).unbind("mouseout").bind("mouseout", function (e) {
			if (!isMouseMoveContains(e, this)) {
				self.suggestHide = true
			} else {
				self.suggestHide = false
			}
		});
		self.container.find('#webSiteUrl').unbind('keydown').bind('keydown', function (e) {
			if (e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 13) {
				if (self.container.find('#webSiteUrlSuggest').css('display') != 'none') {
					var index = self.container.find('#webSiteUrlSuggest li').indexOf(self.container.find('#webSiteUrlSuggest li.selected').get(0));
					if (e.keyCode == 38 || e.keyCode == 40) {
						var nextIndex = 0;
						if (index == -1) {
							if (e.keyCode == 38) {
								nextIndex = self.container.find('#webSiteUrlSuggest li').length - 1
							}
						} else {
							nextIndex = e.keyCode == 38 ? (index - 1) : (index + 1)
						}
						self.container.find('#webSiteUrlSuggest li').removeClass('selected');
						var nextObj = self.container.find('#webSiteUrlSuggest li')[nextIndex];
						if (typeof nextObj != 'undefined') {
							$(nextObj).addClass('selected');
							self.container.find('#webSiteUrl').val('http://' + $(nextObj).attr('url'))
						}
					} else if (e.keyCode == 13) {
						self.container.find('#webSiteUrl').get(0).focus();
						self.container.find('#webSiteUrlSuggest').hide();
						setTimeout(function () {
							self.suggestHide = true
						}, 100);
						return false
					}
				}
			}
		});
		self.container.find('#webSiteUrl').unbind('keyup').bind('keyup', function (e) {
			if (e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 13) {
				return false
			}
			if (self.trends.length > 0) {
				var selfObj = $(this);
				var keyword = $(this).val().replace('http://', '').replace('https://', '');
				var suggestContent = '<ul>';
				$.each(self.trends, function (i, n) {
					if (n.indexOf(keyword) != -1) {
						suggestContent += '<li url="' + n + '">' + n.replace(keyword, '<b>' + keyword + '</b>') + '</li>'
					}
				});
				suggestContent += '</ul>';
				if (self.container.find('#webSiteUrlSuggest').css('display') == 'none') {
					self.container.find('#webSiteUrlSuggest').show()
				}
				self.container.find('#webSiteUrlSuggest').html(suggestContent);
				self.container.find('#webSiteUrlSuggest li').unbind('click').bind('click', function () {
					selfObj.val('http://' + $(this).attr('url'));
					selfObj.get(0).focus();
					self.container.find('#webSiteUrlSuggest').hide();
					setTimeout(function () {
						self.suggestHide = true
					}, 100)
				}).unbind('mouseover').bind('mouseover', function () {
					self.container.find('#webSiteUrlSuggest li').removeClass('selected');
					$(this).addClass('selected')
				})
			}
		})
	},
	pad: function (num, n) {
		var len = num.toString().length;
		while (len < n) {
			num = "0" + num;
			len++
		}
		return num
	}
};
createWebsite.container = $('.createWebsite');
createWebsite.init();
