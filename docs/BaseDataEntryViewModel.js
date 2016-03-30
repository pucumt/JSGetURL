(function()
{
	createNamespace("TF.DataEntry").BaseDataEntryViewModel = BaseDataEntryViewModel;

	function BaseDataEntryViewModel(ids, documentElement, obFocusState, view)
	{
		this.initialize = this.initialize.bind(this);
		this.refreshClick = this.refreshClick.bind(this);
		this.printClick = this.printClick.bind(this);
		this.nextClick = this.nextClick.bind(this);
		this.previousClick = this.previousClick.bind(this);
		this.bookmarkClick = this.bookmarkClick.bind(this);
		this.leftPress = this.leftPress.bind(this);
		this.rightPress = this.rightPress.bind(this);
		this.loadRecord = this.loadRecord.bind(this);
		this._updateEntityStatusMessage = this._updateEntityStatusMessage.bind(this);

		this.bookMarkKey = {
			DBID: tf.datasourceManager.databaseId,
			ClientId: tf.authManager.clientKey,
			Type: "rfweb." + view.type + ".edit" + (view.id == undefined ? "" : ("." + view.id))
		};
		this.obCurrentBookMark = ko.observable(null);

		this.onRequestClose = new TF.Events.Event();
		this.localStorageDataModel = new TF.DataModel.LocalStorageDataModel();

		this.initializationFrontdesk = null;

		this._updateEntityStatusMessageHandler = null;

		this.type = null;
		this.documentType = TF.Document.DocumentData.DataEntry;
		this.obTitle = ko.observable();
		this.obgridTitle = ko.observable();
		this.dataModelType = null;
		this.obEntityDataModel = ko.observable();
		this.obIds = ko.observableArray(ids);


		this._view = view;
		this._documentElement = documentElement;
		this.dataEntryTemplateName = "";
		this.obCurrentPage = ko.observable(this._view.orderID);

		this.obMode = ko.computed(this.modeComputer, this);
		this.obPageTitle = ko.computed(this.pageTitleComputer, this);
		this.obIsEditMode = ko.computed(this.isEditModeComputer, this);
		this.onContentChange = new TF.Events.Event();

		this.obFocusState = obFocusState;
		this.obDisableControl = ko.observable(null);
		this.obUpdateStatus = ko.observable(null);
		this.obUpdateStatusUserName = ko.computed(this.updateStatusUserNameComputer, this);
		this.obLockMessage = ko.computed(this.lockMessageComputer, this);
		this.obModifiedMessage = ko.computed(this.modifiedMessageComputer, this);

		this.obLockDisableControl = ko.computed(this.lockDisableControlComputer, this);

		this.obValidationErrors = ko.observableArray([]);
		this.validatorFields = null;
		this.obErrorMessageDivIsShow = ko.observable(false);
		this.obSuccessMessageDivIsShow = ko.observable(false);
		this.obContentDivHeight = ko.computed(this.showMessageComputer, this);
		//this.obCurrentPage.subscribe(this.loadRecord);// no need reload page anymore(application page)
		//tf.mousetrapWrapper.bind("left", this.leftPress);
		//tf.mousetrapWrapper.bind("right", this.rightPress);
		tf.shortCutKeys.bind("left", this.leftPress, "viewCreat");
		tf.shortCutKeys.bind("right", this.rightPress, "viewCreat");


		this.obUserDefinedColumns = ko.observable($.extend(true, Object, TF.UserDefinedFieldUtil.USER_DEFINED_FIELDS_COLUMN_LABELS));
		this.obUserDefinedCharacterLeft = ko.observableArray();
		this.obUserDefinedCharacterRight = ko.observableArray();
		this.obUserDefinedNumericLeft = ko.observableArray();
		this.obUserDefinedNumericRight = ko.observableArray();
		this.obUserDefinedDateFieldsLeft = ko.observableArray();
		this.obUserDefinedDateFieldsRight = ko.observableArray();
		this.CharacterTypeID = view.type == "student" ? ["0", "1", "2", "3", "12", "13", "14", "15"] : ["0", "1", "2", "3"];
		this.NumericTypeID = ["4", "5", "6", "7"];
		this.dateFieldsTypeID = view.type == "staff" ? ["8", "9", "10", "11", "16", "17", "18", "19"] : ["8", "9", "10", "11"];
		this.obUserDefinedDisplay = ko.computed(this.userDefinedDisplayComputer, this);

		this.obPageNavName = ko.computed(this._pageNavComputer, this);
		this.localization = ko.observable();
	};

	BaseDataEntryViewModel.prototype.getUserDefinedDisplayData = function()
	{
		for (var i in this.obUserDefinedColumns())
		{
			if (this.CharacterTypeID.indexOf(i) != -1 && this.obUserDefinedColumns()[i].Status)
			{
				if (this.obUserDefinedCharacterLeft().length == this.obUserDefinedCharacterRight().length)
				{
					this.obUserDefinedCharacterLeft.push(this.obUserDefinedColumns()[i]);
				}
				else
				{
					this.obUserDefinedCharacterRight.push(this.obUserDefinedColumns()[i]);
				}
				continue;
			}
			if (this.NumericTypeID.indexOf(i) != -1 && this.obUserDefinedColumns()[i].Status)
			{
				if (this.obUserDefinedNumericLeft().length == this.obUserDefinedNumericRight().length)
				{
					this.obUserDefinedNumericLeft.push(this.obUserDefinedColumns()[i]);
				}
				else
				{
					this.obUserDefinedNumericRight.push(this.obUserDefinedColumns()[i]);
				}
				continue;
			}
			if (this.dateFieldsTypeID.indexOf(i) != -1 && this.obUserDefinedColumns()[i].Status)
			{
				if (this.obUserDefinedDateFieldsLeft().length == this.obUserDefinedDateFieldsRight().length)
				{
					this.obUserDefinedDateFieldsLeft.push(this.obUserDefinedColumns()[i]);
				}
				else
				{
					this.obUserDefinedDateFieldsRight.push(this.obUserDefinedColumns()[i]);
				}
				continue;
			}
		}
	}

	BaseDataEntryViewModel.prototype.userDefinedDisplayComputer = function()
	{
		return { Character: this.obUserDefinedCharacterLeft().length > 0, Numeric: this.obUserDefinedNumericLeft().length > 0, DateFields: this.obUserDefinedDateFieldsLeft().length > 0 };
	}

	BaseDataEntryViewModel.prototype._pageNavComputer = function()
	{
		var result = (this.obCurrentPage() + 1) + ' of ' + this.obIds().length;
		return result;
	};

	BaseDataEntryViewModel.prototype.pendingSave = function()
	{
		throw "Not implemented";
	};

	BaseDataEntryViewModel.prototype.previousClick = function(viewModel, e)
	{
		this._changePage(-1);
	};

	BaseDataEntryViewModel.prototype.nextClick = function(viewModel, e)
	{
		this._changePage(1);
	};

	BaseDataEntryViewModel.prototype.bookmarkClick = function(viewModel, e)
	{
		switch (this.obCurrentBookMark())
		{
			case "nonbookmark":
				this.bookMarkKey.Favorite = false;
				break;
			case "bookmarked":
				this.bookMarkKey.Favorite = true;
				break;
			case "favoriteBookmarked":
				this.obCurrentBookMark("nonbookmark");
				return tf.promiseAjax.delete(pathCombine(tf.api.apiPrefix(), "Bookmark", this.bookMarkKey.Type));
				break;
		}
		this.bookMarkKey.BookmarkUrl = location.href;

		tf.promiseAjax.post(pathCombine(tf.api.apiPrefix(), "Bookmark"), { data: this.bookMarkKey })
			.then(function(data)
			{
				if (data.StatusCode == 404)
				{
					tf.promiseBootbox.alert(data.Message, "Warning");
				}
				else
				{
					switch (this.obCurrentBookMark())
					{
						case "nonbookmark":
							this.obCurrentBookMark("bookmarked");
							break;
						case "bookmarked":
							this.obCurrentBookMark("favoriteBookmarked");
							break;
					}
				}
			}.bind(this));
	};

	BaseDataEntryViewModel.prototype.rightPress = function(e, keyCombination)
	{
		if (this.obFocusState())
		{
			this._changePage(1);
		}
	};

	BaseDataEntryViewModel.prototype.leftPress = function(e, keyCombination)
	{
		if (this.obFocusState())
		{
			this._changePage(-1);
		}
	};

	BaseDataEntryViewModel.prototype._changePage = function(pagePath)
	{
		var page = this.obCurrentPage() + pagePath;
		if (page < 0 || page > this.obIds().length - 1)
		{
			return;
		}
		if (this.obEntityDataModel().apiIsDirty() || this.obModifiedMessage())
		{
			this.tryGoAway('changepage')
			.then(function(result)
			{
				if (result)
				{
					this.documentManager.navigateToTab(page, this.type, this.documentType);
					//this.obCurrentPage(page);
				}
			}.bind(this))
		}
		else
		{
			this.documentManager.navigateToTab(page, this.type, this.documentType);
		}
	};

	BaseDataEntryViewModel.prototype.loadBookmark = function()
	{
		return tf.promiseAjax.get(pathCombine(tf.api.apiPrefix(), "Bookmark", this.bookMarkKey.Type))
		.then(function(response)
		{
			var bookmark = response.Items[0];
			if (bookmark == undefined || bookmark == "")
			{
				bookmark = "nonbookmark";
			}
			else if (bookmark == "True")
			{
				bookmark = "favoriteBookmarked";
			}
			else
			{
				bookmark = "bookmarked";
			}
			this.obCurrentBookMark(bookmark);
		}.bind(this))
	}

	BaseDataEntryViewModel.prototype.load = function()
	{
		if (this._view.documentType == TF.Document.DocumentData.UserProfile)
		{
			this.obEntityDataModel(new this.dataModelType());
			return Promise.resolve();
		}

		if (this._view && this._view.id)
		{
			return tf.promiseAjax.get(pathCombine(tf.api.apiPrefix(), this.type, this._view.id))
			.then(function(response)
			{
				var item = response.Items[0];
				if (this._view.mode == "Add")
				{
					item.Id = 0;
					item.APIIsDirty = true;
					item.APIIsNew = true
					item.Guid = "";

				}
				this.obEntityDataModel(new this.dataModelType(item));
				//if (this._view.mode == "Add")
				//{
				//	this.obEntityDataModel().apiIsDirty(true);
				//	this.obEntityDataModel().id(0);
				//}

			}.bind(this))
			.catch(function(response)
			{
				this.obEntityDataModel(new this.dataModelType());
				if (response && response.StatusCode === 404)
				{
					this.omitCurrentRecord();
				}
			}.bind(this))
		}
		else
		{
			return Promise.resolve();
		}
	};

	BaseDataEntryViewModel.prototype.loadLocalization = function()
	{
		tf.promiseAjax.get(pathCombine(tf.api.apiPrefixWithoutDatabase(), "locallization"))
			.then(function(response)
			{
				this.localization(response.Items[0]);
			}.bind(this))
			.catch(function(response)
			{
			}.bind(this))
	}


	BaseDataEntryViewModel.prototype.initialize = function()
	{
		this.loadBookmark();

		this.$form = $(this._documentElement).find(".form");
		var validatorFields = {};
		this.$form.find("input[required]").each(function(n, field)
		{
			var name = $(field).attr("name");
			validatorFields[name] = {
				trigger: "blur change",
				validators: {
					notEmpty: {
						message: " required"
					},
					callback: {
						message: " required",
						callback: function(value, validator, $field)
						{
							if (value == " [None]")
							{
								return false;
							}
							return true;
						}
					}
				}
			}
		});

		this.$form.find("input[data-tf-input-type=Email]").each(function(n, field)
		{
			var name = $(field).attr("name");
			validatorFields[name] = {
				trigger: "blur change",
				validators: {
					emailAddress: {
					}
				}
			}
		});

		this.$form.find("input[data-tf-input-type=Phone]").each(function(n, field)
		{
			var name = $(field).attr("name");
			validatorFields[name] = {
				trigger: "blur change",
				validators: {
					phone: {
						country: tfRegion.toUpperCase(),
						message: " The value is not valid phone number"
					}
				}
			}
		});

		this.$form.find("input[data-tf-validation=notInFuture]").each(function(n, field)
		{
			var name = $(field).attr("name");
			validatorFields[name] = {
				trigger: "blur change",
				validators: {
					date: {
						notInFuture: true,
						format: moment.localeData()._longDateFormat.L,
						message: " must be < " + moment(new Date).format('L')
					}
				}
			}
		});

		this.validatorFields = validatorFields;
		this.obFocusState.subscribe(this.focusStateChange, this);
		this.validationInitialize();
		//not sure why refresh url when initialize  by Weple
		//this.onContentChange.notify();
		this.loadSupplement()
		.then(this.loadRecord);

		PubSub.subscribe(topicCombine(pb.DATA_CHANGE, "bookmark", "edit", this.type), this.updateBookmark.bind(this));
	};

	BaseDataEntryViewModel.prototype.updateBookmark = function(path, args)
	{
		var pageID = args[0];
		var action = args[1];
		if (pageID != undefined && this.obIds() != undefined && this.obCurrentPage() != undefined)
		{
			var viewModalID = this.obIds()[this.obCurrentPage()].id;
			if (pageID == "empty" && viewModalID == undefined)
			{
				this.obCurrentBookMark(action);
			}
			else
			{
				if (pageID == viewModalID)
				{
					this.obCurrentBookMark(action);
				}
			}
		}
	};

	BaseDataEntryViewModel.prototype.loadSupplement = function()
	{
		if (this._view.documentType == TF.Document.DocumentData.UserProfile)
		{
			return;
		}
		return tf.promiseAjax.get(pathCombine(tf.api.apiPrefix(), "userdefinedlabel", this.type))
		.then(function(data)
		{
			var userDefinedColumns = this.obUserDefinedColumns();
			for (var i in data.Items[0])
			{
				userDefinedColumns[i] = data.Items[0][i];
			}
			this.obUserDefinedColumns(userDefinedColumns);
			this.getUserDefinedDisplayData();
		}.bind(this));
	};

	BaseDataEntryViewModel.prototype.validationInitialize = function()
	{
		return this.$form.bootstrapValidator({
			excluded: [':hidden', ':not(:visible)'],
			live: 'enabled',
			message: 'This value is not valid',
			fields: this.validatorFields
		})
		.on('error.validator.bv', function(e, data)
		{
			data.element
				.data('bv.messages')
				.find('.help-block[data-bv-for="' + data.field + '"]').hide()
				.filter('[data-bv-validator="' + data.validator + '"]').show();
		})
		.on('success.field.bv', function(e, data)
		{
			var $parent = data.element.closest('.form-group');
			$parent.removeClass('has-success');
		});
	};


	BaseDataEntryViewModel.prototype.loadRecord = function()
	{
		this._disposeCheckEntityStatus();
		this.$form.data('bootstrapValidator').resetForm();
		this.obErrorMessageDivIsShow(false);
		this.obSuccessMessageDivIsShow(false);
		//not sure why refresh url when initialize  by Weple
		//this.onContentChange.notify();
		this.load()
		.then(function()
		{
			this._setupCheckEntityStatus();
		}.bind(this))

		//TDB: load locallization
		this.loadLocalization();
	};

	BaseDataEntryViewModel.prototype.canClose = function()
	{
		return this.tryGoAway('close');
	};

	BaseDataEntryViewModel.prototype.promiseBootbox = function(type)
	{
		switch (type)
		{
			case 'close':
				return tf.promiseBootbox.threeStateConfirm({ message: "save changes?", backdrop: true, title: "Save Changes", closeButton: true });
			case 'changepage':
				return tf.promiseBootbox.yesNo("There are unsaved changes.  Would you like to save your changes prior to navigating away?", "Unsaved Changes");
		}
		return Promise.resolve(true);
	}

	BaseDataEntryViewModel.prototype.canCloseExpand = function(cover)
	{
		return Promise.resolve()
				.then(function()
				{
					return cover ? this.trySave() : true
				}.bind(this));
	};

	BaseDataEntryViewModel.prototype.focusField = function(viewModel, e)
	{
		$(viewModel.field).focus();
	}

	BaseDataEntryViewModel.prototype.saveClick = function(viewModel, e)
	{
		return this.trySave();
	};

	BaseDataEntryViewModel.prototype.saveAndCloseClick = function(viewModel, e)
	{
		this.trySave()
			.then(function(e)
			{
				if (e)
				{
					this.onRequestClose.notify();
				}
			}.bind(this));
	};

	BaseDataEntryViewModel.prototype.closeClick = function(viewModel, e)
	{
		this.onRequestClose.notify();
	};

	BaseDataEntryViewModel.prototype.pendingSave = function()
	{
		if (this.obEntityDataModel())
		{
			return this.obEntityDataModel().apiIsDirty();
		}
	};

	BaseDataEntryViewModel.prototype.save = function()
	{
		var obEntityDataModel = this.obEntityDataModel();
		var isNew = obEntityDataModel.id() ? false : true;
		return tf.promiseAjax[isNew ? "post" : "put"](pathCombine(tf.api.apiPrefix(), this.type, isNew ? "" : obEntityDataModel.id()),
		{
			data: this.getSaveData(),
			//async:true will generate an non user interaction, which will make window.open opens a Popup
			async: false
		})
		.then(function(data)
		{
			obEntityDataModel.update(data.Items[0]);
			this.onContentChange.notify();
			PubSub.publish(topicCombine(pb.DATA_CHANGE, this.type, pb.EDIT), obEntityDataModel.id());
		}.bind(this))
		.catch(function(response)
		{
		}.bind(this))
	};

	BaseDataEntryViewModel.prototype.getSaveData = function()
	{
		return this.obEntityDataModel().toData();
	}

	BaseDataEntryViewModel.prototype.tryGoAway = function(type)
	{
		return Promise.resolve()
		.then(function()
		{
			if (this.pendingSave())
			{
				return this.promiseBootbox(type)
				.then(function(result)
				{
					if (result == true)
					{
						return this.trySave();
					}
					if (result == false)
					{
						return true;
					}
					if (result == null)
					{
						return false;
					}
				}.bind(this));
			}
			else
			{
				return true;
			}
		}.bind(this))
	};

	BaseDataEntryViewModel.prototype.trySave = function()
	{
		return this.saveValidate()
		.then(function(result)
		{
			if (result)
			{
				return this._saveStatusCheck()
				.then(function(result)
				{
					if (result)
					{
						return this.save()
						.then(function()
						{
							this.obSuccessMessageDivIsShow(true);
							this.obIds(Enumerable.From(this.obIds()).Union([this.obEntityDataModel().id()]).ToArray());
							return true;
						}.bind(this))
					}
				}.bind(this))
			}
		}.bind(this))
		.catch(function(response)
		{
		}.bind(this))
	};

	BaseDataEntryViewModel.prototype._saveStatusCheck = function()
	{
		return this._checkEntityStatusAndSetMessage()
		.then(function()
		{
			if (this.obLockMessage())
			{
				return;
			}
			if (this.obModifiedMessage())
			{
				return tf.promiseBootbox.yesNo(String.format("This record was {0}.  Saving will store the values that you entered.  This may overwrite the changes that they made to this record.  Are you sure you want to save?", this.obModifiedMessage()))
			}
			else
			{
				return true;
			}
		}.bind(this));
	};

	BaseDataEntryViewModel.prototype.saveValidate = function()
	{
		this.obValidationErrors.removeAll();
		this.obErrorMessageDivIsShow(false);
		this.obSuccessMessageDivIsShow(false);
		var validator = this.$form.data("bootstrapValidator");
		return validator.validate()
		.then(function(valid)
		{
			if (!valid)
			{
				var messages = validator.getMessages(validator.getInvalidFields());
				var $fields = validator.getInvalidFields();
				var validationErrors = [];
				$fields.each(function(i, fielddata)
				{
					if (i == 0)
					{
						$(fielddata).focus();
					}
					var message = messages[i].replace('&lt;', '<').replace('&gt;', '>');
					if (message == " required")
					{
						message = " is required";
					}
					validationErrors.push({ name: ($(fielddata).attr('data-bv-error-name') ? $(fielddata).attr('data-bv-error-name') : $(fielddata).closest("div.form-group").find("label").text()), message: message, field: $(fielddata) });
				}.bind(this));
				this.obErrorMessageDivIsShow(true);
				this.obValidationErrors(validationErrors);
				return false;
			}
			else
			{
				return true;
			}
		}.bind(this));
	};

	BaseDataEntryViewModel.prototype._setupCheckEntityStatus = function()
	{
		if (this._view.documentType == TF.Document.DocumentData.UserProfile)
		{
			return;
		}
		if (this.obIds().length > 0)
		{
			this._updateEntityStatusMessage();
		}
	};

	BaseDataEntryViewModel.prototype._disposeCheckEntityStatus = function()
	{
		clearTimeout(this._updateEntityStatusMessageHandler);
	};

	BaseDataEntryViewModel.prototype._updateEntityStatusMessage = function()
	{
		if (this.obFocusState())
		{
			clearTimeout(this._updateEntityStatusMessageHandler);
			this._checkEntityStatusAndSetMessage()
			.then(function(result)
			{
				if (result)
				{
					this._updateEntityStatusMessageHandler = setTimeout(this._updateEntityStatusMessage, 30000);
				}
			}.bind(this))
		}
	};

	BaseDataEntryViewModel.prototype._checkEntityStatusAndSetMessage = function()
	{
		if (this._view.documentType == TF.Document.DocumentData.UserProfile)
		{
			return;
		}

		if (this._view && this._view.id)
		{
			return tf.promiseAjax.get(pathCombine(tf.api.apiPrefix(), this.type, "updatestatus"), {
				paramData: {
					id: this.obIds()[this.obCurrentPage()].id,
					compareTime: this.obEntityDataModel().lastUpdated()
				}
			},
			{ overlay: false })
			.then(function(response)
			{
				this.obUpdateStatus(response.Items[0]);
				return true;
			}.bind(this))
		}
		else
		{
			return Promise.resolve();
		}
	};

	BaseDataEntryViewModel.prototype.updateStatusUserNameComputer = function()
	{
		var name = "";
		var updateStatus = this.obUpdateStatus();
		if (updateStatus)
		{
			var userEntity = updateStatus.User;
			if (userEntity)
			{
				if (userEntity.FirstName && userEntity.LastName)
				{
					return userEntity.FirstName + " " + userEntity.LastName;
				}
				else
				{
					return userEntity.FirstName + userEntity.LastName;
				}
			}
		}
		return name;
	};

	BaseDataEntryViewModel.prototype.showMessageComputer = function()
	{
		var contentHeightCSS = "dataentry-container-init";
		var errorMessageDivvIsShow = this.obErrorMessageDivIsShow();
		var successMessageDivvIsShow = this.obSuccessMessageDivIsShow();
		if (errorMessageDivvIsShow)
		{
			contentHeightCSS = "dataentry-container-error";
		}
		if (successMessageDivvIsShow)
		{
			contentHeightCSS = "dataentry-container-success";
		}
		return contentHeightCSS
	};

	BaseDataEntryViewModel.prototype.lockMessageComputer = function()
	{
		var message = null;
		var updateStatus = this.obUpdateStatus();
		if (updateStatus)
		{
			if (updateStatus.Status == "Locked")
			{
				message = "Locked";
				if (this.obUpdateStatusUserName())
				{
					message += " by " + this.obUpdateStatusUserName();
				}
			}
		}
		return message;
	};

	BaseDataEntryViewModel.prototype.lockDisableControlComputer = function()
	{
		var updateStatus = this.obUpdateStatus();
		if (updateStatus)
		{
			if (updateStatus.Status == "Locked")
			{
				return true;
			}
		}
		return false;
	};


	BaseDataEntryViewModel.prototype.modifiedMessageComputer = function()
	{
		var message = null;
		var updateStatus = this.obUpdateStatus();
		if (updateStatus)
		{
			if (updateStatus.Status == "Modified")
			{
				message = "Modified";
				if (this.obUpdateStatusUserName())
				{
					return message += " by " + this.obUpdateStatusUserName();
				}
				if (updateStatus.LastUpdated)
				{
					message += " " + moment(updateStatus.LastUpdated).format("L LT");
				}
			}
		}
		return message;
	};

	BaseDataEntryViewModel.prototype.focusStateChange = function()
	{
		this._setupCheckEntityStatus();
	};

	BaseDataEntryViewModel.prototype.modeComputer = function()
	{
		if (this._view.mode)
		{
			return this._view.mode;
		}
		else
		{
			if (this._view && this._view.id)
			{
				return "Edit";
			}
			else
			{
				return "Add";
			}
		}
	};

	BaseDataEntryViewModel.prototype.pageTitleComputer = function()
	{
		switch (this.obMode())
		{
			case "Edit":
				return i18n.t("dataentry.common.page_title_edit", { type: this.obTitle() });
			case "Add":
				return i18n.t("dataentry.common.page_title_add", { type: this.obTitle() });
		}
	};

	BaseDataEntryViewModel.prototype.generateFunction = function(fn)
	{
		return fn.bind(this, Array.prototype.slice.call(arguments, 1));
	}

	BaseDataEntryViewModel.prototype.addDataEntryListItem = function(parameters)
	{
		tf.modalManager.showModal(new TF.Modal.ModifyDataEntryListItemModalViewModel(parameters[0], this.type, this.localization))
		.then(function(data)
		{
			if (!data)
			{
				return;
			}
			parameters[1].push(data);
		}.bind(this));
	}

	BaseDataEntryViewModel.prototype.addNewEntity = function(parameters, viewModel, e)
	{
		var documentData = new TF.Document.DocumentData(TF.Document.DocumentData.DataEntry, { type: parameters[0], ids: [] });
		tf.documentManagerViewModel.add(documentData, TF.DocumentManagerViewModel.isOpenNewWindow(e));
	};

	//BaseDataEntryViewModel.prototype.initializeMap = function(viewModel, el)
	//{
	//	var map = tf.map.mapUtility.createTFMap($(el)[0]);
	//	this._map = map;
	//	var xcoord = 0;
	//	var ycoord = 0;
	//	if (this.obEntityDataModel()["xcoord"] && this.obEntityDataModel().xcoord() != null)
	//	{
	//		xcoord = this.obEntityDataModel().xcoord();
	//	}
	//	if (this.obEntityDataModel()["ycoord"] && this.obEntityDataModel().ycoord() != null)
	//	{
	//		ycoord = this.obEntityDataModel().ycoord();
	//	}
	//	var olGeometry = tf.converter.GeoJson2OlGeometry({ type: "Point", coordinates: [xcoord, ycoord] });
	//	map.setCenter([olGeometry.x, olGeometry.y], 11);
	//};

	//BaseDataEntryViewModel.prototype.reInitializeMap = function(viewModel, el)
	//{
	//	viewModel._map.destroy();
	//	viewModel.initializeMap(viewModel, el);
	//};

	BaseDataEntryViewModel.prototype.printClick = function(viewModel, e)
	{
		window.print();
	};

	BaseDataEntryViewModel.prototype.refreshClick = function(viewModel, e)
	{
		this._checkEntityStatusAndSetMessage()
		.then(function()
		{
			if (this.obEntityDataModel().apiIsDirty() || this.obModifiedMessage())
			{
				return tf.promiseBootbox.yesNo("This record has been modified since it was last loaded or there are unsaved changes.  Refreshing will discard any unsaved changes.  Are you sure you want to refresh?");
			}
			else
			{
				return true;
			}
		}.bind(this))
		.then(function(result)
		{
			if (result)
			{
				this.loadSupplement()
				.then(this.loadRecord);
			}
		}.bind(this))
	};

	BaseDataEntryViewModel.prototype.omitCurrentRecord = function()
	{
		var currentPage = this.obCurrentPage();
		this.obIds.remove(this.obIds()[currentPage]);
		if (currentPage > this.obIds().length - 1)
		{
			this.obCurrentPage(currentPage - 1);
		}
		else
		{
			this.loadRecord();
		}
		if (!this.obIds().length)
		{
			tf.promiseBootbox.alert("There are no records in the underlining table.  This may be due to records being deleted by another user.")
			.then(function()
			{
				this.onRequestClose.notify();
			}.bind(this))
		}
	};

	BaseDataEntryViewModel.prototype.isEditModeComputer = function()
	{
		return this.obMode() == "Edit";
	};

	BaseDataEntryViewModel.prototype.setSelectValue = function(field)
	{
		return function(scope, event)
		{
			var observableField = this.obEntityDataModel()[field];
			if (observableField() != event.target.value)
			{
				observableField(event.target.value);
			}
		}
	};

	BaseDataEntryViewModel.prototype.isNotSpecialEdit = function()
	{
		if (this._view.documentType == TF.Document.DocumentData.UserProfile)
		{
			return false;
		}
		return true;
	};

	BaseDataEntryViewModel.prototype.dispose = function()
	{
		//tf.mousetrapWrapper.unbind("left", this.leftPress);
		//tf.mousetrapWrapper.unbind("right", this.rightPress);
		tf.shortCutKeys.unbind("left", this.leftPress, "viewCreat");
		tf.shortCutKeys.unbind("right", this.rightPress, "viewCreat");
		this.onContentChange.unsubscribeAll();
		this.onRequestClose.unsubscribeAll();
		clearTimeout(this._updateEntityStatusMessageHandler);
	};

})();
