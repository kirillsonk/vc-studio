Invoice/estimate rows — the pricing surface of the brand. Numbers are strings when they are text («включено», «по факту»).
```jsx
<Ledger title="Project estimate" rows={[{label:'AI-инфраструктура',sub:'по фактическому расходу',value:12840},{label:'Production-команда',value:94000},{label:'Поддержка 3 месяца',value:'включено',tone:'positive'}]} total={106840} totalLabel="Итоговый бюджет" />
```
