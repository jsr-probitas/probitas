# API Migration Tables: Probitas CLI 0.4.0 → 0.5.0

## HTTP Client

**Summary:** 19 methods → 92 methods

| 0.4.0 Method                     | 0.5.0 (Continue)                 | 0.5.0 (Added)                      | 0.5.0 (Changed)                            | 0.5.0 (Removed) |
| -------------------------------- | -------------------------------- | ---------------------------------- | ------------------------------------------ | --------------- |
| toBeSuccessful                   |                                  |                                    | toBeOk                                     |                 |
| toHaveBodyContaining             |                                  |                                    | toHaveBodySatisfying                       |                 |
| toHaveContent                    |                                  |                                    | toHaveDataPresent                          |                 |
| toHaveContentType                |                                  |                                    | toHaveHeadersProperty("content-type", ...) |                 |
| toHaveDurationGreaterThan        | toHaveDurationGreaterThan        |                                    |                                            |                 |
| toHaveDurationGreaterThanOrEqual | toHaveDurationGreaterThanOrEqual |                                    |                                            |                 |
| toHaveDurationLessThan           | toHaveDurationLessThan           |                                    |                                            |                 |
| toHaveDurationLessThanOrEqual    | toHaveDurationLessThanOrEqual    |                                    |                                            |                 |
| toHaveHeader                     |                                  |                                    | toHaveHeadersProperty                      |                 |
| toHaveHeaderContaining           |                                  |                                    | toHaveHeadersPropertySatisfying            |                 |
| toHaveHeaderMatching             |                                  |                                    | toHaveHeadersPropertySatisfying            |                 |
| toHaveHeaderValue                |                                  |                                    | toHaveHeadersProperty                      |                 |
| toHaveStatus                     | toHaveStatus                     |                                    |                                            |                 |
| toHaveStatusOneOf                | toHaveStatusOneOf                |                                    |                                            |                 |
| toHaveTextContaining             | toHaveTextContaining             |                                    |                                            |                 |
| toMatchObject                    |                                  |                                    | toHaveDataMatching                         |                 |
| toSatisfy                        |                                  |                                    | toHaveDataSatisfying                       |                 |
| toSatisfyBody                    |                                  |                                    | toHaveBodySatisfying                       |                 |
| toSatisfyText                    |                                  |                                    | toHaveTextSatisfying                       |                 |
|                                  |                                  | toHaveBody                         |                                            |                 |
|                                  |                                  | toHaveBodyEqual                    |                                            |                 |
|                                  |                                  | toHaveBodyLength                   |                                            |                 |
|                                  |                                  | toHaveBodyLengthCloseTo            |                                            |                 |
|                                  |                                  | toHaveBodyLengthEqual              |                                            |                 |
|                                  |                                  | toHaveBodyLengthGreaterThan        |                                            |                 |
|                                  |                                  | toHaveBodyLengthGreaterThanOrEqual |                                            |                 |
|                                  |                                  | toHaveBodyLengthLessThan           |                                            |                 |
|                                  |                                  | toHaveBodyLengthLessThanOrEqual    |                                            |                 |
|                                  |                                  | toHaveBodyLengthNaN                |                                            |                 |
|                                  |                                  | toHaveBodyLengthSatisfying         |                                            |                 |
|                                  |                                  | toHaveBodyLengthStrictEqual        |                                            |                 |
|                                  |                                  | toHaveBodyNull                     |                                            |                 |
|                                  |                                  | toHaveBodyNullish                  |                                            |                 |
|                                  |                                  | toHaveBodyPresent                  |                                            |                 |
|                                  |                                  | toHaveBodyStrictEqual              |                                            |                 |
|                                  |                                  | toHaveBodyUndefined                |                                            |                 |
|                                  |                                  | toHaveData                         |                                            |                 |
|                                  |                                  | toHaveDataEqual                    |                                            |                 |
|                                  |                                  | toHaveDataNull                     |                                            |                 |
|                                  |                                  | toHaveDataNullish                  |                                            |                 |
|                                  |                                  | toHaveDataProperty                 |                                            |                 |
|                                  |                                  | toHaveDataPropertyContaining       |                                            |                 |
|                                  |                                  | toHaveDataPropertyMatching         |                                            |                 |
|                                  |                                  | toHaveDataStrictEqual              |                                            |                 |
|                                  |                                  | toHaveDataUndefined                |                                            |                 |
|                                  |                                  | toHaveDuration                     |                                            |                 |
|                                  |                                  | toHaveDurationCloseTo              |                                            |                 |
|                                  |                                  | toHaveDurationEqual                |                                            |                 |
|                                  |                                  | toHaveDurationNaN                  |                                            |                 |
|                                  |                                  | toHaveDurationSatisfying           |                                            |                 |
|                                  |                                  | toHaveDurationStrictEqual          |                                            |                 |
|                                  |                                  | toHaveHeaders                      |                                            |                 |
|                                  |                                  | toHaveHeadersEqual                 |                                            |                 |
|                                  |                                  | toHaveHeadersMatching              |                                            |                 |
|                                  |                                  | toHaveHeadersSatisfying            |                                            |                 |
|                                  |                                  | toHaveHeadersStrictEqual           |                                            |                 |
|                                  |                                  | toHaveStatusCloseTo                |                                            |                 |
|                                  |                                  | toHaveStatusEqual                  |                                            |                 |
|                                  |                                  | toHaveStatusGreaterThan            |                                            |                 |
|                                  |                                  | toHaveStatusGreaterThanOrEqual     |                                            |                 |
|                                  |                                  | toHaveStatusLessThan               |                                            |                 |
|                                  |                                  | toHaveStatusLessThanOrEqual        |                                            |                 |
|                                  |                                  | toHaveStatusNaN                    |                                            |                 |
|                                  |                                  | toHaveStatusSatisfying             |                                            |                 |
|                                  |                                  | toHaveStatusStrictEqual            |                                            |                 |
|                                  |                                  | toHaveStatusText                   |                                            |                 |
|                                  |                                  | toHaveStatusTextContaining         |                                            |                 |
|                                  |                                  | toHaveStatusTextEqual              |                                            |                 |
|                                  |                                  | toHaveStatusTextMatching           |                                            |                 |
|                                  |                                  | toHaveStatusTextSatisfying         |                                            |                 |
|                                  |                                  | toHaveStatusTextStrictEqual        |                                            |                 |
|                                  |                                  | toHaveText                         |                                            |                 |
|                                  |                                  | toHaveTextEqual                    |                                            |                 |
|                                  |                                  | toHaveTextLength                   |                                            |                 |
|                                  |                                  | toHaveTextLengthCloseTo            |                                            |                 |
|                                  |                                  | toHaveTextLengthEqual              |                                            |                 |
|                                  |                                  | toHaveTextLengthGreaterThan        |                                            |                 |
|                                  |                                  | toHaveTextLengthGreaterThanOrEqual |                                            |                 |
|                                  |                                  | toHaveTextLengthLessThan           |                                            |                 |
|                                  |                                  | toHaveTextLengthLessThanOrEqual    |                                            |                 |
|                                  |                                  | toHaveTextLengthNaN                |                                            |                 |
|                                  |                                  | toHaveTextLengthSatisfying         |                                            |                 |
|                                  |                                  | toHaveTextLengthStrictEqual        |                                            |                 |
|                                  |                                  | toHaveTextMatching                 |                                            |                 |
|                                  |                                  | toHaveTextNull                     |                                            |                 |
|                                  |                                  | toHaveTextNullish                  |                                            |                 |
|                                  |                                  | toHaveTextPresent                  |                                            |                 |
|                                  |                                  | toHaveTextStrictEqual              |                                            |                 |
|                                  |                                  | toHaveTextUndefined                |                                            |                 |
|                                  |                                  | toHaveUrl                          |                                            |                 |
|                                  |                                  | toHaveUrlContaining                |                                            |                 |
|                                  |                                  | toHaveUrlEqual                     |                                            |                 |
|                                  |                                  | toHaveUrlMatching                  |                                            |                 |
|                                  |                                  | toHaveUrlSatisfying                |                                            |                 |
|                                  |                                  | toHaveUrlStrictEqual               |                                            |                 |

## GRAPHQL Client

**Summary:** 18 methods → 76 methods

| 0.4.0 Method                       | 0.5.0 (Continue)                   | 0.5.0 (Added)                   | 0.5.0 (Changed)                  | 0.5.0 (Removed) |
| ---------------------------------- | ---------------------------------- | ------------------------------- | -------------------------------- | --------------- |
| toBeSuccessful                     |                                    |                                 | toBeOk                           |                 |
| toHaveContent                      |                                    |                                 | toHaveDataPresent                |                 |
| toHaveDurationGreaterThan          | toHaveDurationGreaterThan          |                                 |                                  |                 |
| toHaveDurationGreaterThanOrEqual   | toHaveDurationGreaterThanOrEqual   |                                 |                                  |                 |
| toHaveDurationLessThan             | toHaveDurationLessThan             |                                 |                                  |                 |
| toHaveDurationLessThanOrEqual      | toHaveDurationLessThanOrEqual      |                                 |                                  |                 |
| toHaveError                        |                                    |                                 | toHaveErrorsPresent              |                 |
| toHaveErrorContaining              |                                    |                                 | toHaveErrorsContaining           |                 |
| toHaveErrorCount                   | toHaveErrorCount                   |                                 |                                  |                 |
| toHaveErrorCountGreaterThan        | toHaveErrorCountGreaterThan        |                                 |                                  |                 |
| toHaveErrorCountGreaterThanOrEqual | toHaveErrorCountGreaterThanOrEqual |                                 |                                  |                 |
| toHaveErrorCountLessThan           | toHaveErrorCountLessThan           |                                 |                                  |                 |
| toHaveErrorCountLessThanOrEqual    | toHaveErrorCountLessThanOrEqual    |                                 |                                  |                 |
| toHaveErrorMatching                |                                    |                                 | toHaveErrorsMatching             |                 |
| toHaveExtension                    |                                    |                                 | toHaveExtensionsProperty         |                 |
| toHaveExtensionMatching            |                                    |                                 | toHaveExtensionsPropertyMatching |                 |
| toHaveStatus                       | toHaveStatus                       |                                 |                                  |                 |
| toHaveStatusOneOf                  | toHaveStatusOneOf                  |                                 |                                  |                 |
|                                    |                                    | toHaveData                      |                                  |                 |
|                                    |                                    | toHaveDataEqual                 |                                  |                 |
|                                    |                                    | toHaveDataMatching              |                                  |                 |
|                                    |                                    | toHaveDataNull                  |                                  |                 |
|                                    |                                    | toHaveDataNullish               |                                  |                 |
|                                    |                                    | toHaveDataProperty              |                                  |                 |
|                                    |                                    | toHaveDataPropertyContaining    |                                  |                 |
|                                    |                                    | toHaveDataPropertyMatching      |                                  |                 |
|                                    |                                    | toHaveDataSatisfying            |                                  |                 |
|                                    |                                    | toHaveDataStrictEqual           |                                  |                 |
|                                    |                                    | toHaveDataUndefined             |                                  |                 |
|                                    |                                    | toHaveDuration                  |                                  |                 |
|                                    |                                    | toHaveDurationCloseTo           |                                  |                 |
|                                    |                                    | toHaveDurationEqual             |                                  |                 |
|                                    |                                    | toHaveDurationNaN               |                                  |                 |
|                                    |                                    | toHaveDurationSatisfying        |                                  |                 |
|                                    |                                    | toHaveDurationStrictEqual       |                                  |                 |
|                                    |                                    | toHaveErrorCountCloseTo         |                                  |                 |
|                                    |                                    | toHaveErrorCountEqual           |                                  |                 |
|                                    |                                    | toHaveErrorCountNaN             |                                  |                 |
|                                    |                                    | toHaveErrorCountSatisfying      |                                  |                 |
|                                    |                                    | toHaveErrorCountStrictEqual     |                                  |                 |
|                                    |                                    | toHaveErrors                    |                                  |                 |
|                                    |                                    | toHaveErrorsEmpty               |                                  |                 |
|                                    |                                    | toHaveErrorsEqual               |                                  |                 |
|                                    |                                    | toHaveErrorsNull                |                                  |                 |
|                                    |                                    | toHaveErrorsNullish             |                                  |                 |
|                                    |                                    | toHaveErrorsSatisfying          |                                  |                 |
|                                    |                                    | toHaveErrorsStrictEqual         |                                  |                 |
|                                    |                                    | toHaveErrorsUndefined           |                                  |                 |
|                                    |                                    | toHaveExtensions                |                                  |                 |
|                                    |                                    | toHaveExtensionsEqual           |                                  |                 |
|                                    |                                    | toHaveExtensionsMatching        |                                  |                 |
|                                    |                                    | toHaveExtensionsNull            |                                  |                 |
|                                    |                                    | toHaveExtensionsNullish         |                                  |                 |
|                                    |                                    | toHaveExtensionsPresent         |                                  |                 |
|                                    |                                    | toHaveExtensionsSatisfying      |                                  |                 |
|                                    |                                    | toHaveExtensionsStrictEqual     |                                  |                 |
|                                    |                                    | toHaveExtensionsUndefined       |                                  |                 |
|                                    |                                    | toHaveHeaders                   |                                  |                 |
|                                    |                                    | toHaveHeadersEqual              |                                  |                 |
|                                    |                                    | toHaveHeadersMatching           |                                  |                 |
|                                    |                                    | toHaveHeadersProperty           |                                  |                 |
|                                    |                                    | toHaveHeadersPropertyContaining |                                  |                 |
|                                    |                                    | toHaveHeadersPropertyMatching   |                                  |                 |
|                                    |                                    | toHaveHeadersSatisfying         |                                  |                 |
|                                    |                                    | toHaveHeadersStrictEqual        |                                  |                 |
|                                    |                                    | toHaveStatusCloseTo             |                                  |                 |
|                                    |                                    | toHaveStatusEqual               |                                  |                 |
|                                    |                                    | toHaveStatusGreaterThan         |                                  |                 |
|                                    |                                    | toHaveStatusGreaterThanOrEqual  |                                  |                 |
|                                    |                                    | toHaveStatusLessThan            |                                  |                 |
|                                    |                                    | toHaveStatusLessThanOrEqual     |                                  |                 |
|                                    |                                    | toHaveStatusNaN                 |                                  |                 |
|                                    |                                    | toHaveStatusSatisfying          |                                  |                 |
|                                    |                                    | toHaveStatusStrictEqual         |                                  |                 |

## SQL Client

**Summary:** 15 methods → 49 methods

| 0.4.0 Method                     | 0.5.0 (Continue)                 | 0.5.0 (Added)                 | 0.5.0 (Changed)                   | 0.5.0 (Removed) |
| -------------------------------- | -------------------------------- | ----------------------------- | --------------------------------- | --------------- |
| toBeSuccessful                   |                                  |                               | toBeOk                            |                 |
| toHaveContent                    |                                  |                               | toHaveRowsPresent                 |                 |
| toHaveDurationGreaterThan        | toHaveDurationGreaterThan        |                               |                                   |                 |
| toHaveDurationGreaterThanOrEqual | toHaveDurationGreaterThanOrEqual |                               |                                   |                 |
| toHaveDurationLessThan           | toHaveDurationLessThan           |                               |                                   |                 |
| toHaveDurationLessThanOrEqual    | toHaveDurationLessThanOrEqual    |                               |                                   |                 |
| toHaveLastInsertId               | toHaveLastInsertId               |                               |                                   |                 |
| toHaveLength                     |                                  |                               | toHaveRowsCount                   |                 |
| toHaveLengthGreaterThanOrEqual   |                                  |                               | toHaveRowsCountGreaterThanOrEqual |                 |
| toHaveLengthLessThanOrEqual      |                                  |                               | toHaveRowsCountLessThanOrEqual    |                 |
| toHaveRowCount                   | toHaveRowCount                   |                               |                                   |                 |
| toHaveRowCountGreaterThanOrEqual | toHaveRowCountGreaterThanOrEqual |                               |                                   |                 |
| toHaveRowCountLessThanOrEqual    | toHaveRowCountLessThanOrEqual    |                               |                                   |                 |
| toMatchObject                    |                                  |                               | toHaveRowsMatching                |                 |
| toSatisfy                        |                                  |                               | toHaveRowsSatisfying              |                 |
|                                  |                                  | toHaveDuration                |                                   |                 |
|                                  |                                  | toHaveDurationCloseTo         |                                   |                 |
|                                  |                                  | toHaveDurationEqual           |                                   |                 |
|                                  |                                  | toHaveDurationNaN             |                                   |                 |
|                                  |                                  | toHaveDurationSatisfying      |                                   |                 |
|                                  |                                  | toHaveDurationStrictEqual     |                                   |                 |
|                                  |                                  | toHaveLastInsertIdEqual       |                                   |                 |
|                                  |                                  | toHaveLastInsertIdNull        |                                   |                 |
|                                  |                                  | toHaveLastInsertIdNullish     |                                   |                 |
|                                  |                                  | toHaveLastInsertIdPresent     |                                   |                 |
|                                  |                                  | toHaveLastInsertIdSatisfying  |                                   |                 |
|                                  |                                  | toHaveLastInsertIdStrictEqual |                                   |                 |
|                                  |                                  | toHaveLastInsertIdUndefined   |                                   |                 |
|                                  |                                  | toHaveRowCountCloseTo         |                                   |                 |
|                                  |                                  | toHaveRowCountEqual           |                                   |                 |
|                                  |                                  | toHaveRowCountGreaterThan     |                                   |                 |
|                                  |                                  | toHaveRowCountLessThan        |                                   |                 |
|                                  |                                  | toHaveRowCountNaN             |                                   |                 |
|                                  |                                  | toHaveRowCountSatisfying      |                                   |                 |
|                                  |                                  | toHaveRowCountStrictEqual     |                                   |                 |
|                                  |                                  | toHaveRows                    |                                   |                 |
|                                  |                                  | toHaveRowsContaining          |                                   |                 |
|                                  |                                  | toHaveRowsContainingEqual     |                                   |                 |
|                                  |                                  | toHaveRowsEmpty               |                                   |                 |
|                                  |                                  | toHaveRowsEqual               |                                   |                 |
|                                  |                                  | toHaveRowsStrictEqual         |                                   |                 |
|                                  |                                  | toHaveWarnings                |                                   |                 |
|                                  |                                  | toHaveWarningsContaining      |                                   |                 |
|                                  |                                  | toHaveWarningsContainingEqual |                                   |                 |
|                                  |                                  | toHaveWarningsEmpty           |                                   |                 |
|                                  |                                  | toHaveWarningsEqual           |                                   |                 |
|                                  |                                  | toHaveWarningsMatching        |                                   |                 |
|                                  |                                  | toHaveWarningsNull            |                                   |                 |
|                                  |                                  | toHaveWarningsNullish         |                                   |                 |
|                                  |                                  | toHaveWarningsPresent         |                                   |                 |
|                                  |                                  | toHaveWarningsSatisfying      |                                   |                 |
|                                  |                                  | toHaveWarningsStrictEqual     |                                   |                 |
|                                  |                                  | toHaveWarningsUndefined       |                                   |                 |

## MONGODB Client

**Summary:** 33 methods → 115 methods

| 0.4.0 Method                          | 0.5.0 (Continue)                      | 0.5.0 (Added)                    | 0.5.0 (Changed)                            | 0.5.0 (Removed) |
| ------------------------------------- | ------------------------------------- | -------------------------------- | ------------------------------------------ | --------------- |
| toBeSuccessful                        |                                       |                                  | toBeOk                                     |                 |
| toHaveContent                         |                                       |                                  | toHaveDocsPresent / toHaveDocPresent       |                 |
| toHaveDeletedCount                    | toHaveDeletedCount                    |                                  |                                            |                 |
| toHaveDeletedCountGreaterThan         | toHaveDeletedCountGreaterThan         |                                  |                                            |                 |
| toHaveDeletedCountGreaterThanOrEqual  | toHaveDeletedCountGreaterThanOrEqual  |                                  |                                            |                 |
| toHaveDeletedCountLessThan            | toHaveDeletedCountLessThan            |                                  |                                            |                 |
| toHaveDeletedCountLessThanOrEqual     | toHaveDeletedCountLessThanOrEqual     |                                  |                                            |                 |
| toHaveDurationGreaterThan             | toHaveDurationGreaterThan             |                                  |                                            |                 |
| toHaveDurationGreaterThanOrEqual      | toHaveDurationGreaterThanOrEqual      |                                  |                                            |                 |
| toHaveDurationLessThan                | toHaveDurationLessThan                |                                  |                                            |                 |
| toHaveDurationLessThanOrEqual         | toHaveDurationLessThanOrEqual         |                                  |                                            |                 |
| toHaveInsertedCount                   | toHaveInsertedCount                   |                                  |                                            |                 |
| toHaveInsertedCountGreaterThan        | toHaveInsertedCountGreaterThan        |                                  |                                            |                 |
| toHaveInsertedCountGreaterThanOrEqual | toHaveInsertedCountGreaterThanOrEqual |                                  |                                            |                 |
| toHaveInsertedCountLessThan           | toHaveInsertedCountLessThan           |                                  |                                            |                 |
| toHaveInsertedCountLessThanOrEqual    | toHaveInsertedCountLessThanOrEqual    |                                  |                                            |                 |
| toHaveInsertedId                      | toHaveInsertedId                      |                                  |                                            |                 |
| toHaveLength                          |                                       |                                  | toHaveDocsCount                            |                 |
| toHaveLengthGreaterThanOrEqual        |                                       |                                  | toHaveDocsCountGreaterThanOrEqual          |                 |
| toHaveLengthLessThanOrEqual           |                                       |                                  | toHaveDocsCountLessThanOrEqual             |                 |
| toHaveMatchedCount                    | toHaveMatchedCount                    |                                  |                                            |                 |
| toHaveMatchedCountGreaterThan         | toHaveMatchedCountGreaterThan         |                                  |                                            |                 |
| toHaveMatchedCountGreaterThanOrEqual  | toHaveMatchedCountGreaterThanOrEqual  |                                  |                                            |                 |
| toHaveMatchedCountLessThan            | toHaveMatchedCountLessThan            |                                  |                                            |                 |
| toHaveMatchedCountLessThanOrEqual     | toHaveMatchedCountLessThanOrEqual     |                                  |                                            |                 |
| toHaveModifiedCount                   | toHaveModifiedCount                   |                                  |                                            |                 |
| toHaveModifiedCountGreaterThan        | toHaveModifiedCountGreaterThan        |                                  |                                            |                 |
| toHaveModifiedCountGreaterThanOrEqual | toHaveModifiedCountGreaterThanOrEqual |                                  |                                            |                 |
| toHaveModifiedCountLessThan           | toHaveModifiedCountLessThan           |                                  |                                            |                 |
| toHaveModifiedCountLessThanOrEqual    | toHaveModifiedCountLessThanOrEqual    |                                  |                                            |                 |
| toHaveUpsertedId                      | toHaveUpsertedId                      |                                  |                                            |                 |
| toMatchObject                         |                                       |                                  | toHaveDocsMatching / toHaveDocMatching     |                 |
| toSatisfy                             |                                       |                                  | toHaveDocsSatisfying / toHaveDocSatisfying |                 |
|                                       |                                       | toHaveCount                      |                                            |                 |
|                                       |                                       | toHaveCountCloseTo               |                                            |                 |
|                                       |                                       | toHaveCountEqual                 |                                            |                 |
|                                       |                                       | toHaveCountGreaterThan           |                                            |                 |
|                                       |                                       | toHaveCountGreaterThanOrEqual    |                                            |                 |
|                                       |                                       | toHaveCountLessThan              |                                            |                 |
|                                       |                                       | toHaveCountLessThanOrEqual       |                                            |                 |
|                                       |                                       | toHaveCountNaN                   |                                            |                 |
|                                       |                                       | toHaveCountSatisfying            |                                            |                 |
|                                       |                                       | toHaveCountStrictEqual           |                                            |                 |
|                                       |                                       | toHaveDeletedCountCloseTo        |                                            |                 |
|                                       |                                       | toHaveDeletedCountEqual          |                                            |                 |
|                                       |                                       | toHaveDeletedCountNaN            |                                            |                 |
|                                       |                                       | toHaveDeletedCountSatisfying     |                                            |                 |
|                                       |                                       | toHaveDeletedCountStrictEqual    |                                            |                 |
|                                       |                                       | toHaveDoc                        |                                            |                 |
|                                       |                                       | toHaveDocEqual                   |                                            |                 |
|                                       |                                       | toHaveDocMatching                |                                            |                 |
|                                       |                                       | toHaveDocNull                    |                                            |                 |
|                                       |                                       | toHaveDocNullish                 |                                            |                 |
|                                       |                                       | toHaveDocPresent                 |                                            |                 |
|                                       |                                       | toHaveDocProperty                |                                            |                 |
|                                       |                                       | toHaveDocPropertyContaining      |                                            |                 |
|                                       |                                       | toHaveDocPropertyMatching        |                                            |                 |
|                                       |                                       | toHaveDocSatisfying              |                                            |                 |
|                                       |                                       | toHaveDocStrictEqual             |                                            |                 |
|                                       |                                       | toHaveDocUndefined               |                                            |                 |
|                                       |                                       | toHaveDocs                       |                                            |                 |
|                                       |                                       | toHaveDocsContaining             |                                            |                 |
|                                       |                                       | toHaveDocsContainingEqual        |                                            |                 |
|                                       |                                       | toHaveDocsEmpty                  |                                            |                 |
|                                       |                                       | toHaveDocsEqual                  |                                            |                 |
|                                       |                                       | toHaveDocsStrictEqual            |                                            |                 |
|                                       |                                       | toHaveDuration                   |                                            |                 |
|                                       |                                       | toHaveDurationCloseTo            |                                            |                 |
|                                       |                                       | toHaveDurationEqual              |                                            |                 |
|                                       |                                       | toHaveDurationNaN                |                                            |                 |
|                                       |                                       | toHaveDurationSatisfying         |                                            |                 |
|                                       |                                       | toHaveDurationStrictEqual        |                                            |                 |
|                                       |                                       | toHaveInsertedCountCloseTo       |                                            |                 |
|                                       |                                       | toHaveInsertedCountEqual         |                                            |                 |
|                                       |                                       | toHaveInsertedCountNaN           |                                            |                 |
|                                       |                                       | toHaveInsertedCountSatisfying    |                                            |                 |
|                                       |                                       | toHaveInsertedCountStrictEqual   |                                            |                 |
|                                       |                                       | toHaveInsertedIdContaining       |                                            |                 |
|                                       |                                       | toHaveInsertedIdEqual            |                                            |                 |
|                                       |                                       | toHaveInsertedIdMatching         |                                            |                 |
|                                       |                                       | toHaveInsertedIdSatisfying       |                                            |                 |
|                                       |                                       | toHaveInsertedIdStrictEqual      |                                            |                 |
|                                       |                                       | toHaveInsertedIds                |                                            |                 |
|                                       |                                       | toHaveInsertedIdsContaining      |                                            |                 |
|                                       |                                       | toHaveInsertedIdsContainingEqual |                                            |                 |
|                                       |                                       | toHaveInsertedIdsEmpty           |                                            |                 |
|                                       |                                       | toHaveInsertedIdsEqual           |                                            |                 |
|                                       |                                       | toHaveInsertedIdsMatching        |                                            |                 |
|                                       |                                       | toHaveInsertedIdsSatisfying      |                                            |                 |
|                                       |                                       | toHaveInsertedIdsStrictEqual     |                                            |                 |
|                                       |                                       | toHaveMatchedCountCloseTo        |                                            |                 |
|                                       |                                       | toHaveMatchedCountEqual          |                                            |                 |
|                                       |                                       | toHaveMatchedCountNaN            |                                            |                 |
|                                       |                                       | toHaveMatchedCountSatisfying     |                                            |                 |
|                                       |                                       | toHaveMatchedCountStrictEqual    |                                            |                 |
|                                       |                                       | toHaveModifiedCountCloseTo       |                                            |                 |
|                                       |                                       | toHaveModifiedCountEqual         |                                            |                 |
|                                       |                                       | toHaveModifiedCountNaN           |                                            |                 |
|                                       |                                       | toHaveModifiedCountSatisfying    |                                            |                 |
|                                       |                                       | toHaveModifiedCountStrictEqual   |                                            |                 |
|                                       |                                       | toHaveUpsertedIdContaining       |                                            |                 |
|                                       |                                       | toHaveUpsertedIdEqual            |                                            |                 |
|                                       |                                       | toHaveUpsertedIdMatching         |                                            |                 |
|                                       |                                       | toHaveUpsertedIdNull             |                                            |                 |
|                                       |                                       | toHaveUpsertedIdNullish          |                                            |                 |
|                                       |                                       | toHaveUpsertedIdPresent          |                                            |                 |
|                                       |                                       | toHaveUpsertedIdSatisfying       |                                            |                 |
|                                       |                                       | toHaveUpsertedIdStrictEqual      |                                            |                 |
|                                       |                                       | toHaveUpsertedIdUndefined        |                                            |                 |

## REDIS Client

**Summary:** 12 methods → 42 methods

| 0.4.0 Method                     | 0.5.0 (Continue)                 | 0.5.0 (Added)             | 0.5.0 (Changed)                    | 0.5.0 (Removed) |
| -------------------------------- | -------------------------------- | ------------------------- | ---------------------------------- | --------------- |
| toBeSuccessful                   |                                  |                           | toBeOk                             |                 |
| toContain                        |                                  |                           | toHaveValueContaining              |                 |
| toHaveContent                    |                                  |                           | toHaveValuePresent                 |                 |
| toHaveData                       |                                  |                           | toHaveValue                        |                 |
| toHaveDurationGreaterThan        | toHaveDurationGreaterThan        |                           |                                    |                 |
| toHaveDurationGreaterThanOrEqual | toHaveDurationGreaterThanOrEqual |                           |                                    |                 |
| toHaveDurationLessThan           | toHaveDurationLessThan           |                           |                                    |                 |
| toHaveDurationLessThanOrEqual    | toHaveDurationLessThanOrEqual    |                           |                                    |                 |
| toHaveLength                     |                                  |                           | toHaveValueCount                   |                 |
| toHaveLengthGreaterThanOrEqual   |                                  |                           | toHaveValueCountGreaterThanOrEqual |                 |
| toHaveLengthLessThanOrEqual      |                                  |                           | toHaveValueCountLessThanOrEqual    |                 |
| toSatisfy                        |                                  |                           | toHaveValueSatisfying              |                 |
|                                  |                                  | toHaveDuration            |                                    |                 |
|                                  |                                  | toHaveDurationCloseTo     |                                    |                 |
|                                  |                                  | toHaveDurationEqual       |                                    |                 |
|                                  |                                  | toHaveDurationNaN         |                                    |                 |
|                                  |                                  | toHaveDurationSatisfying  |                                    |                 |
|                                  |                                  | toHaveDurationStrictEqual |                                    |                 |

## RABBITMQ Client

**Summary:** 21 methods → 67 methods

| 0.4.0 Method                          | 0.5.0 (Continue)                      | 0.5.0 (Added)                         | 0.5.0 (Changed)                 | 0.5.0 (Removed) |
| ------------------------------------- | ------------------------------------- | ------------------------------------- | ------------------------------- | --------------- |
| toBeSuccessful                        |                                       |                                       | toBeOk                          |                 |
| toHaveBodyContaining                  |                                       |                                       | toHaveContentSatisfying         |                 |
| toHaveConsumerCount                   | toHaveConsumerCount                   |                                       |                                 |                 |
| toHaveConsumerCountGreaterThan        | toHaveConsumerCountGreaterThan        |                                       |                                 |                 |
| toHaveConsumerCountGreaterThanOrEqual | toHaveConsumerCountGreaterThanOrEqual |                                       |                                 |                 |
| toHaveConsumerCountLessThan           | toHaveConsumerCountLessThan           |                                       |                                 |                 |
| toHaveConsumerCountLessThanOrEqual    | toHaveConsumerCountLessThanOrEqual    |                                       |                                 |                 |
| toHaveContent                         | toHaveContent                         |                                       |                                 |                 |
| toHaveDurationGreaterThan             | toHaveDurationGreaterThan             |                                       |                                 |                 |
| toHaveDurationGreaterThanOrEqual      | toHaveDurationGreaterThanOrEqual      |                                       |                                 |                 |
| toHaveDurationLessThan                | toHaveDurationLessThan                |                                       |                                 |                 |
| toHaveDurationLessThanOrEqual         | toHaveDurationLessThanOrEqual         |                                       |                                 |                 |
| toHaveExchange                        |                                       |                                       |                                 | ✓               |
| toHaveMessageCount                    | toHaveMessageCount                    |                                       |                                 |                 |
| toHaveMessageCountGreaterThan         | toHaveMessageCountGreaterThan         |                                       |                                 |                 |
| toHaveMessageCountGreaterThanOrEqual  | toHaveMessageCountGreaterThanOrEqual  |                                       |                                 |                 |
| toHaveMessageCountLessThan            | toHaveMessageCountLessThan            |                                       |                                 |                 |
| toHaveMessageCountLessThanOrEqual     | toHaveMessageCountLessThanOrEqual     |                                       |                                 |                 |
| toHavePropertyContaining              |                                       |                                       | toHaveMessagePropertyContaining |                 |
| toHaveRoutingKey                      |                                       |                                       |                                 | ✓               |
| toSatisfy                             |                                       |                                       | toHaveMessageSatisfying         |                 |
|                                       |                                       | toHaveConsumerCountCloseTo            |                                 |                 |
|                                       |                                       | toHaveConsumerCountEqual              |                                 |                 |
|                                       |                                       | toHaveConsumerCountNaN                |                                 |                 |
|                                       |                                       | toHaveConsumerCountSatisfying         |                                 |                 |
|                                       |                                       | toHaveConsumerCountStrictEqual        |                                 |                 |
|                                       |                                       | toHaveContentEqual                    |                                 |                 |
|                                       |                                       | toHaveContentLength                   |                                 |                 |
|                                       |                                       | toHaveContentLengthCloseTo            |                                 |                 |
|                                       |                                       | toHaveContentLengthEqual              |                                 |                 |
|                                       |                                       | toHaveContentLengthGreaterThan        |                                 |                 |
|                                       |                                       | toHaveContentLengthGreaterThanOrEqual |                                 |                 |
|                                       |                                       | toHaveContentLengthLessThan           |                                 |                 |
|                                       |                                       | toHaveContentLengthLessThanOrEqual    |                                 |                 |
|                                       |                                       | toHaveContentLengthNaN                |                                 |                 |
|                                       |                                       | toHaveContentLengthSatisfying         |                                 |                 |
|                                       |                                       | toHaveContentLengthStrictEqual        |                                 |                 |
|                                       |                                       | toHaveContentNull                     |                                 |                 |
|                                       |                                       | toHaveContentNullish                  |                                 |                 |
|                                       |                                       | toHaveContentPresent                  |                                 |                 |
|                                       |                                       | toHaveContentStrictEqual              |                                 |                 |
|                                       |                                       | toHaveContentUndefined                |                                 |                 |
|                                       |                                       | toHaveDuration                        |                                 |                 |
|                                       |                                       | toHaveDurationCloseTo                 |                                 |                 |
|                                       |                                       | toHaveDurationEqual                   |                                 |                 |
|                                       |                                       | toHaveDurationNaN                     |                                 |                 |
|                                       |                                       | toHaveDurationSatisfying              |                                 |                 |
|                                       |                                       | toHaveDurationStrictEqual             |                                 |                 |
|                                       |                                       | toHaveMessage                         |                                 |                 |
|                                       |                                       | toHaveMessageCountCloseTo             |                                 |                 |
|                                       |                                       | toHaveMessageCountEqual               |                                 |                 |
|                                       |                                       | toHaveMessageCountNaN                 |                                 |                 |
|                                       |                                       | toHaveMessageCountSatisfying          |                                 |                 |
|                                       |                                       | toHaveMessageCountStrictEqual         |                                 |                 |
|                                       |                                       | toHaveMessageEqual                    |                                 |                 |
|                                       |                                       | toHaveMessageMatching                 |                                 |                 |
|                                       |                                       | toHaveMessageNull                     |                                 |                 |
|                                       |                                       | toHaveMessageNullish                  |                                 |                 |
|                                       |                                       | toHaveMessagePresent                  |                                 |                 |
|                                       |                                       | toHaveMessageProperty                 |                                 |                 |
|                                       |                                       | toHaveMessagePropertyMatching         |                                 |                 |
|                                       |                                       | toHaveMessageStrictEqual              |                                 |                 |
|                                       |                                       | toHaveMessageUndefined                |                                 |                 |
|                                       |                                       | toHaveQueue                           |                                 |                 |
|                                       |                                       | toHaveQueueContaining                 |                                 |                 |
|                                       |                                       | toHaveQueueEqual                      |                                 |                 |
|                                       |                                       | toHaveQueueMatching                   |                                 |                 |
|                                       |                                       | toHaveQueueSatisfying                 |                                 |                 |
|                                       |                                       | toHaveQueueStrictEqual                |                                 |                 |

## SQS Client

**Summary:** 29 methods → 83 methods

| 0.4.0 Method                            | 0.5.0 (Continue)                        | 0.5.0 (Added)                    | 0.5.0 (Changed)                       | 0.5.0 (Removed) |
| --------------------------------------- | --------------------------------------- | -------------------------------- | ------------------------------------- | --------------- |
| toBeAllSuccessful                       |                                         |                                  |                                       | ✓               |
| toBeSuccessful                          |                                         |                                  | toBeOk                                |                 |
| toHaveAttribute                         |                                         |                                  |                                       | ✓               |
| toHaveAttributesContaining              |                                         |                                  |                                       | ✓               |
| toHaveBodyContaining                    |                                         |                                  | toHaveMessagesSatisfying              |                 |
| toHaveBodyMatching                      |                                         |                                  | toHaveMessagesMatching                |                 |
| toHaveContent                           |                                         |                                  | toHaveMessagesPresent                 |                 |
| toHaveDurationGreaterThan               | toHaveDurationGreaterThan               |                                  |                                       |                 |
| toHaveDurationGreaterThanOrEqual        | toHaveDurationGreaterThanOrEqual        |                                  |                                       |                 |
| toHaveDurationLessThan                  | toHaveDurationLessThan                  |                                  |                                       |                 |
| toHaveDurationLessThanOrEqual           | toHaveDurationLessThanOrEqual           |                                  |                                       |                 |
| toHaveFailedCount                       | toHaveFailedCount                       |                                  |                                       |                 |
| toHaveFailedCountGreaterThan            | toHaveFailedCountGreaterThan            |                                  |                                       |                 |
| toHaveFailedCountGreaterThanOrEqual     | toHaveFailedCountGreaterThanOrEqual     |                                  |                                       |                 |
| toHaveFailedCountLessThan               | toHaveFailedCountLessThan               |                                  |                                       |                 |
| toHaveFailedCountLessThanOrEqual        | toHaveFailedCountLessThanOrEqual        |                                  |                                       |                 |
| toHaveLength                            |                                         |                                  | toHaveMessagesCount                   |                 |
| toHaveLengthGreaterThanOrEqual          |                                         |                                  | toHaveMessagesCountGreaterThanOrEqual |                 |
| toHaveLengthLessThanOrEqual             |                                         |                                  | toHaveMessagesCountLessThanOrEqual    |                 |
| toHaveMessageId                         | toHaveMessageId                         |                                  |                                       |                 |
| toHaveQueueUrl                          | toHaveQueueUrl                          |                                  |                                       |                 |
| toHaveQueueUrlContaining                | toHaveQueueUrlContaining                |                                  |                                       |                 |
| toHaveSuccessfulCount                   | toHaveSuccessfulCount                   |                                  |                                       |                 |
| toHaveSuccessfulCountGreaterThan        | toHaveSuccessfulCountGreaterThan        |                                  |                                       |                 |
| toHaveSuccessfulCountGreaterThanOrEqual | toHaveSuccessfulCountGreaterThanOrEqual |                                  |                                       |                 |
| toHaveSuccessfulCountLessThan           | toHaveSuccessfulCountLessThan           |                                  |                                       |                 |
| toHaveSuccessfulCountLessThanOrEqual    | toHaveSuccessfulCountLessThanOrEqual    |                                  |                                       |                 |
| toMatchObject                           |                                         |                                  | toHaveMessagesMatching                |                 |
| toSatisfy                               |                                         |                                  | toHaveMessagesSatisfying              |                 |
|                                         |                                         | toHaveDuration                   |                                       |                 |
|                                         |                                         | toHaveDurationCloseTo            |                                       |                 |
|                                         |                                         | toHaveDurationEqual              |                                       |                 |
|                                         |                                         | toHaveDurationNaN                |                                       |                 |
|                                         |                                         | toHaveDurationSatisfying         |                                       |                 |
|                                         |                                         | toHaveDurationStrictEqual        |                                       |                 |
|                                         |                                         | toHaveFailed                     |                                       |                 |
|                                         |                                         | toHaveFailedContaining           |                                       |                 |
|                                         |                                         | toHaveFailedContainingEqual      |                                       |                 |
|                                         |                                         | toHaveFailedCountCloseTo         |                                       |                 |
|                                         |                                         | toHaveFailedCountEqual           |                                       |                 |
|                                         |                                         | toHaveFailedCountNaN             |                                       |                 |
|                                         |                                         | toHaveFailedCountSatisfying      |                                       |                 |
|                                         |                                         | toHaveFailedCountStrictEqual     |                                       |                 |
|                                         |                                         | toHaveFailedEmpty                |                                       |                 |
|                                         |                                         | toHaveFailedEqual                |                                       |                 |
|                                         |                                         | toHaveFailedMatching             |                                       |                 |
|                                         |                                         | toHaveFailedSatisfying           |                                       |                 |
|                                         |                                         | toHaveFailedStrictEqual          |                                       |                 |
|                                         |                                         | toHaveMessageIdContaining        |                                       |                 |
|                                         |                                         | toHaveMessageIdEqual             |                                       |                 |
|                                         |                                         | toHaveMessageIdMatching          |                                       |                 |
|                                         |                                         | toHaveMessageIdSatisfying        |                                       |                 |
|                                         |                                         | toHaveMessageIdStrictEqual       |                                       |                 |
|                                         |                                         | toHaveMessages                   |                                       |                 |
|                                         |                                         | toHaveMessagesContaining         |                                       |                 |
|                                         |                                         | toHaveMessagesContainingEqual    |                                       |                 |
|                                         |                                         | toHaveMessagesEmpty              |                                       |                 |
|                                         |                                         | toHaveMessagesEqual              |                                       |                 |
|                                         |                                         | toHaveMessagesStrictEqual        |                                       |                 |
|                                         |                                         | toHaveQueueUrlEqual              |                                       |                 |
|                                         |                                         | toHaveQueueUrlMatching           |                                       |                 |
|                                         |                                         | toHaveQueueUrlSatisfying         |                                       |                 |
|                                         |                                         | toHaveQueueUrlStrictEqual        |                                       |                 |
|                                         |                                         | toHaveSequenceNumber             |                                       |                 |
|                                         |                                         | toHaveSequenceNumberContaining   |                                       |                 |
|                                         |                                         | toHaveSequenceNumberEqual        |                                       |                 |
|                                         |                                         | toHaveSequenceNumberMatching     |                                       |                 |
|                                         |                                         | toHaveSequenceNumberSatisfying   |                                       |                 |
|                                         |                                         | toHaveSequenceNumberStrictEqual  |                                       |                 |
|                                         |                                         | toHaveSuccessful                 |                                       |                 |
|                                         |                                         | toHaveSuccessfulContaining       |                                       |                 |
|                                         |                                         | toHaveSuccessfulContainingEqual  |                                       |                 |
|                                         |                                         | toHaveSuccessfulCountCloseTo     |                                       |                 |
|                                         |                                         | toHaveSuccessfulCountEqual       |                                       |                 |
|                                         |                                         | toHaveSuccessfulCountNaN         |                                       |                 |
|                                         |                                         | toHaveSuccessfulCountSatisfying  |                                       |                 |
|                                         |                                         | toHaveSuccessfulCountStrictEqual |                                       |                 |
|                                         |                                         | toHaveSuccessfulEmpty            |                                       |                 |
|                                         |                                         | toHaveSuccessfulEqual            |                                       |                 |
|                                         |                                         | toHaveSuccessfulMatching         |                                       |                 |
|                                         |                                         | toHaveSuccessfulSatisfying       |                                       |                 |
|                                         |                                         | toHaveSuccessfulStrictEqual      |                                       |                 |
