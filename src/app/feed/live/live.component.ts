import { Component, OnInit } from '@angular/core';
import { FeedService } from '../feed.service';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { GridOptions, ColumnApi, GridApi } from 'ag-grid';
import { FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'mg-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit {

  public form: FormGroup;
  public symbol: AbstractControl;
  public exchange: AbstractControl;

  public liveGridApi: GridApi;
  public liveGridOptions: GridOptions;
  public liveColumnApi: ColumnApi;

  private symbolOptions = [];
  private symbolDropdownSettings = {};
  private symbolSelectedItems = [];

  private exchangeOptions = [];
  private exchangeDropdownSettings = {};
  private exchangeSelectionItems = [];

  private liveTradeFirebaseData: any;

  constructor(fb: FormBuilder, private hs: FeedService) { 

    this.form = fb.group({
      'symbol': ['', Validators.compose([Validators.required])],
      'exchange': ['', Validators.compose([Validators.required])]
    });

    this.symbol = this.form.controls['symbol'];
    this.exchange = this.form.controls['exchange'];

    this.symbolDropdownSettings = { 
      singleSelection: false, 
      text:"Select Symbols",
      selectAllText:'Select All',
      unSelectAllText:'UnSelect All',
      badgeShowLimit: 3,
      enableSearchFilter: true
    };

    this.exchangeDropdownSettings = { 
      singleSelection: true, 
      text:"Select Exchange",
      enableSearchFilter: true
    };

    this.liveGridOptions = <GridOptions>{};
    this.liveGridOptions.columnDefs = [
      { headerName: 'Exchange', field: 'Exchange' },
      { headerName: 'Symbol', field: 'Symbol' },
      { headerName: 'Trade', field: 'Trade' },
      { headerName: 'Price', field: 'Price' },
      { headerName: 'Timestamp', field: 'Date', cellRenderer: 'animateShowChange' }
    ];
    this.liveGridOptions.rowData = [];
  }

  ngOnInit() {
    this.hs.fetchAllExchange().subscribe((data) => {
      this.exchangeOptions = [];
      for(let obj of data) {
        this.exchangeOptions.push({
          id: obj['ID'],
          itemName: obj['VALUE']
        });
      }
    });

    this.hs.fetchLiveTradeData().subscribe((data) => {
      this.liveTradeFirebaseData = [];
      this.liveTradeFirebaseData = data.data;
    });
  }

  onExchangeItemSelect(item){
    this.hs.fetchDistinctSymbol(item['itemName']).subscribe((data) => {
      this.symbol.reset();
      this.symbolOptions = [];
      for(let obj of data) {
        this.symbolOptions.push({
          id: obj['ID'],
          itemName: obj['VALUE']
        });
      }
    });
  }

  onSymbolItemSelect(item){
    // FirebaseListObservable
  }

}
