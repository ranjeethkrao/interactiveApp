import { Component, OnInit, OnDestroy } from '@angular/core';
import { FeedService } from '../feed.service';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { GridOptions, ColumnApi, GridApi } from 'ag-grid';
import { FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'mg-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public symbol: AbstractControl;
  public exchange: AbstractControl;

  public liveGridApi: GridApi;
  public liveGridOptions: GridOptions;
  public liveColumnApi: ColumnApi;

  public symbolOptions = [];
  public symbolDropdownSettings = {};
  public symbolSelectedItems = [];

  public exchangeOptions = [];
  public exchangeDropdownSettings = {};
  public exchangeSelectionItems = [];

  public liveTradeFirebaseData: any;
  public rowData = [];

  public timer;

  constructor(fb: FormBuilder, private hs: FeedService) {

    this.form = fb.group({
      'symbol': ['', Validators.compose([Validators.required])],
      'exchange': ['', Validators.compose([Validators.required])]
    });

    this.symbol = this.form.controls['symbol'];
    this.exchange = this.form.controls['exchange'];

    this.symbolDropdownSettings = {
      singleSelection: false,
      text: "Select Symbols",
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      badgeShowLimit: 3,
      enableSearchFilter: true
    };

    this.exchangeDropdownSettings = {
      singleSelection: false,
      text: "Select Exchange",
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      badgeShowLimit: 3,
      enableSearchFilter: true
    };

    this.liveGridOptions = <GridOptions>{};
    this.liveGridOptions.columnDefs = [
      { headerName: 'Exchange', field: 'Exchange' },
      { headerName: 'Symbol', field: 'Symbol' },
      { headerName: 'Trade', field: 'Trade' },
      { headerName: 'Price', field: 'Price' },
      { headerName: 'Timestamp', field: 'Date', cellRenderer:'agAnimateShowChangeCellRenderer', comparator: dateComparator, sort: 'desc' }
    ];
    this.liveGridOptions.rowData = [];

    function dateComparator(date1, date2) {
      
      var date1Number = new Date(date1).getTime();
      var date2Number = new Date(date2).getTime();

      if (date1Number === date2Number) {
        return 0;
      }
      if (date1Number < date2Number) {
        return -1;
      }
      if (date1Number > date2Number) {
        return 1;
      }
      
    }
    
  }

  ngOnInit() {
    this.hs.fetchAllExchange().subscribe((data) => {
      this.exchangeOptions = [];
      for (let obj of data) {
        this.exchangeOptions.push({
          id: obj['ID'],
          itemName: obj['VALUE']
        });
      }
    });

    this.hs.getSelectedItems(JSON.parse(localStorage.getItem('user')).email).subscribe((data) => {
      this.exchangeSelectionItems = data.exchange;
      this.symbolSelectedItems = data.symbols;
      this.onExchangeItemSelect(null);
      this.onSymbolItemSelect(null);      
    })
  }

  onGridReady(params){
    this.liveGridApi = params.api;
    this.liveColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  onExchangeItemSelect(item) {
    if(this.exchangeSelectionItems.length === 0){
      this.symbol.reset();
      this.symbolOptions.length = 0;
      this.liveGridOptions.api.setRowData([])
      clearTimeout(this.timer);
    } else {
      this.hs.fetchDistinctSymbol(this.exchangeSelectionItems.map(item=>item['itemName'])).subscribe((data) => {
        // if(item)     // A null means that selection is not from grid
        //   this.symbol.reset();
        this.symbolOptions = [];
        for (let obj of data) {
          this.symbolOptions.push({
            id: obj['ID'],
            data: obj['VALUE'],
            itemName: obj['VALUE']['Symbol']
          });
        }
      });
    }
  }

  onSymbolItemSelect(item) {
    if(item)
      this.setSelected();   // A null means that selection is not from grid
    this.rowData = this.symbolSelectedItems.map(symbol=>symbol.data);
    this.liveGridOptions.api.setRowData(this.rowData);
    clearTimeout(this.timer);
    if(this.symbolSelectedItems.length > 0){
      this.timeoutTarget(this.liveGridApi);
    }
  }

  timeoutTarget(gridApi) {
    this.hs.fetchLiveTradeData().subscribe((data) => {
      let updatedItems = [];
      Object.keys(data).forEach(key=>{
        updatedItems.push(data[key]);
      });

      let itemsToUpdate  = [];
      let rowNodes = [];
      updatedItems.forEach(item=>{
        gridApi.forEachNodeAfterFilterAndSort((node, index)=>{
          let data = node.data;
          if(data.Symbol === item.Symbol){
            Object.keys(data).forEach(key=>{
              data[key] = item[key]
            })
            itemsToUpdate.push(data);
            rowNodes.push(node);
          }
        })
      });
      
      gridApi.flashCells({ rowNodes: rowNodes });
      gridApi.updateRowData({ update: itemsToUpdate });

      
    });
    this.timer = setTimeout(this.timeoutTarget.bind(this), 1000, gridApi);
  }

  setSelected(){
    this.hs.setSelectedItems(JSON.parse(localStorage.getItem('user')).email, {exchange: this.exchangeSelectionItems, symbols: this.symbolSelectedItems}).subscribe(res => {});
  }

  ngOnDestroy(){
    clearTimeout(this.timer);
  }

}
