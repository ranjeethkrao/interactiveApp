import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { GridOptions } from 'ag-grid';
import { ComboBoxComponent } from './combo-box/combo-box.component';
import { environment } from '../../environments/environment';

@Component({
  selector: 'mg-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {

  admins = [];
  changes = [];
  rowData;
  gridOptions: GridOptions;
  constructor(private http: Http) {
    this.gridOptions = <GridOptions>{
      columnDefs: this.createColumnDefs(),
      onGridSizeChanged: () => {
        this.gridOptions.api.sizeColumnsToFit();
      }
    };
  }

   ngOnInit() {
    this.http.get( environment.url + '/user/gusers').subscribe(res=>{
      this.gridOptions.api.setRowData(JSON.parse(res['_body']));
    });
  }


  createColumnDefs() {
    return [
      { headerName: 'First Name', field: 'firstname' },
      { headerName: 'Email', field: 'email' },
      { headerName: 'User ID', field: 'username' },
      { headerName: 'Follows', field: 'follows', cellEditorFramework: ComboBoxComponent, editable: true }
    ];
  }

  saveData() {
    if(this.changes.length > 0){
      const headers = new Headers();
      headers.append('Content-Type', 'application/json; charset=utf-8')
      this.http.post(environment.url + '/user/changes', {changes:this.changes}, {headers: headers}).subscribe(res=>{
        let response = JSON.parse(res['_body']);
        if(response['code'] === 0){
          alert('Save successful');
        } else {
          alert('Error: ' + response['message']);
        }
      });
      this.changes = [];

    } else {
      alert('Nothing to save...');
    }
  }

  valueChanged(event){
    this.changes.push({uuid: event.data.uuid, newValue: event.newValue});
  }

}
