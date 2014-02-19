config {
	no_cache = 1
	debug = 0
	xhtml_cleaning = 0
	admPanel = 0
	disableAllHeaderCode = 1
	sendCacheHeaders = 0
	sys_language_uid = 0
	sys_language_mode = ignore
	sys_language_overlay = 1
#	additionalHeaders = Content-Type: application/json; charset=utf-8
}

watcher {
	tableFields {
		pages = uid,_ORIG_uid,pid,sorting,title
		sys_category = uid,_ORIG_uid,_LOCALIZED_UID,pid,sys_language_uid,title,parent,items,sys_language_uid
		tt_content = uid,_ORIG_uid,_LOCALIZED_UID,pid,sorting,sys_language_uid,header,categories,tx_irretutorial_hotels
		tx_irretutorial_1nff_hotel = uid,_ORIG_uid,_LOCALIZED_UID,pid,sorting,sys_language_uid,title,offers
		tx_irretutorial_1nff_offer = uid,_ORIG_uid,_LOCALIZED_UID,pid,sorting,sys_language_uid,title,prices
		tx_irretutorial_1nff_price = uid,_ORIG_uid,_LOCALIZED_UID,pid,sorting,sys_language_uid,title,price
	}
}

page = PAGE
page {
	10 = CONTENT
	10 {
		watcher.parentRecordField = __contents
		table = tt_content
		select {
			orderBy = sorting
			where = colPos=0
			languageField = sys_language_uid
		}
		renderObj = COA
		renderObj {
			10 = CONTENT
			10 {
				if.isTrue.field = categories
				watcher.parentRecordField = categories
				table = sys_category
				select {
					pidInList = 0
					uidInList.preUserFunc = TYPO3\CMS\Core\Tests\Functional\Framework\Frontend\UserFunction->getManyToManyIds
					uidInList.preUserFunc {
						uidForeign.data = field:_ORIG_uid // field:uid
						manyToManyTableName = sys_category_record_mm
						matchTableName = tt_content
						matchFieldName = categories
					}
					selectFields = sys_category.*
					join = sys_category_record_mm ON sys_category_record_mm.uid_local = sys_category.uid
					where.data = field:_ORIG_uid // field:uid
					where.intval = 1
					where.wrap = sys_category_record_mm.uid_foreign=|
					orderBy = sys_category_record_mm.sorting_foreign
					languageField = sys_category.sys_language_uid
				}
			}
			20 = CONTENT
			20 {
				if.isTrue.field = tx_irretutorial_hotels
				watcher.parentRecordField = tx_irretutorial_hotels
				table = tx_irretutorial_1nff_hotel
				select {
					orderBy = sorting
					where.field = uid
					where.intval = 1
					where.wrap = parenttable="tt_content" AND parentid=|
					languageField = sys_language_uid
				}
				renderObj = CONTENT
				renderObj {
					if.isTrue.field = offers
					watcher.parentRecordField = offers
					table = tx_irretutorial_1nff_offer
					select {
						orderBy = sorting
						where.field = uid
						where.intval = 1
						where.wrap = parenttable="tx_irretutorial_1nff_hotel" AND parentid=|
						languageField = sys_language_uid
					}
					renderObj = CONTENT
					renderObj {
						if.isTrue.field = prices
						watcher.parentRecordField = prices
						table = tx_irretutorial_1nff_price
						select {
							orderBy = sorting
							where.field = uid
							where.intval = 1
							where.wrap = parenttable="tx_irretutorial_1nff_offer" AND parentid=|
							languageField = sys_language_uid
						}
					}
				}
			}
		}
	}
}

[globalVar = GP:L = 1]
config.sys_language_uid = 1
[end]