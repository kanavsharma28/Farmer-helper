import React, { useState } from 'react';

export default function HowItWorksAccordion({ lang = 'en' }) {
  const isEn = lang === 'en';
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden shadow-2xs">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-surface-container-low transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">menu_book</span>
          </div>
          <div>
            <h3 className="font-label-md text-sm sm:text-base font-bold text-on-surface">
              {isEn ? 'How does the Profit Calculator work?' : 'Calculation कैसे होती है? (फार्मूला व नियम)'}
            </h3>
            <p className="font-caption text-xs text-on-surface-variant">
              {isEn
                ? 'Understand the mathematical formulas behind our calculations'
                : 'सरल भाषा में समझें लागत, कमाई और ब्रेक-ईवन की वास्तविक गणित'}
            </p>
          </div>
        </div>

        <span
          className={`material-symbols-outlined text-on-surface-variant transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          expand_more
        </span>
      </button>

      {isOpen && (
        <div className="p-4 sm:p-6 pt-0 border-t border-outline-variant/15 flex flex-col gap-4 text-xs sm:text-sm text-on-surface-variant leading-relaxed animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
              <strong className="text-on-surface font-bold block mb-1">
                1. {isEn ? 'Total Cultivation Cost' : 'कुल खेती लागत (Total Cost)'}:
              </strong>
              <code>बीज + खाद + कीटनाशक + मजदूरी + सिंचाई + मशीनरी + अन्य</code>
              <p className="mt-1 text-xs">
                {isEn
                  ? 'Sum of all 7 direct agricultural input categories.'
                  : 'फसल बोने से लेकर कटाई तक के सभी 7 मुख्य मदों का योग।'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
              <strong className="text-on-surface font-bold block mb-1">
                2. {isEn ? 'Gross Revenue' : 'कुल कमाई (Gross Revenue)'}:
              </strong>
              <code>अनुमानित कुल उपज (क्विंटल) × बिक्री भाव (प्रति क्विंटल)</code>
              <p className="mt-1 text-xs">
                {isEn
                  ? 'Total harvest production multiplied by expected market rate.'
                  : 'कुल फसल पैदावार को मंडी बिक्री भाव से गुणा करने पर प्राप्त राशि।'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
              <strong className="text-on-surface font-bold block mb-1">
                3. {isEn ? 'Net Farmer Profit' : 'शुद्ध किसान मुनाफा (Net Profit)'}:
              </strong>
              <code>कुल कमाई − कुल खेती लागत</code>
              <p className="mt-1 text-xs">
                {isEn
                  ? 'In-hand money left for the farmer after paying all inputs and labour.'
                  : 'सभी खर्चों और कटौतियों के बाद किसान के हाथ में बचने वाली शुद्ध बचत।'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
              <strong className="text-on-surface font-bold block mb-1">
                4. {isEn ? 'Break-Even Price' : 'ब्रेक-ईवन भाव (Zero-Loss Rate)'}:
              </strong>
              <code>कुल खेती लागत ÷ कुल उपज (क्विंटल)</code>
              <p className="mt-1 text-xs">
                {isEn
                  ? 'The lowest price you must receive to not lose any money.'
                  : 'वह न्यूनतम भाव जिस पर फसल बेचने से आपकी लागत पूरी निकल जाती है (नो-प्रॉफिट, नो-लॉस)।'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
