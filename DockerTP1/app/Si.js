const express = require( "express" );
const path = require( "path" );
const shell = require("shelljs");
var mysql = require('mysql');
/*"/home/gaudio/Documentos/Tak/views"*/
var connection = mysql.createConnection({
	host: "mysql",
	//port: "3306",
	user: "mysql",
	password: "1234",
	database: "ecommerce"
});
let current = new Date();
let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
let dateTime = cDate + ' ' + cTime;
console.log(dateTime);




/*
connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
*/

connection.connect();
shell.cp( "-R", path.join( __dirname, "views" ), "dist/" );
const app = express();
const port = 3000; // default port to listen

// define a route handler for the default home page
app.set( "views", path.join( __dirname, "views" ) );
app.set( "view engine", "ejs" );

app.get( "/", ( req, res ) => {
    res.render( "Si" );
} );

app.get( "/productos", ( req, res ) => {
	res.set({ 'Content-Type': 'application/json; charset=utf-8' });
	var productos = "Simastru";
	console.log("Productos");
	console.log(req.query.busqueda);
	console.log(req.query.usado);
	console.log(req.query.orden);
	var busqueda;
	var usado;
	var orden;
	if(req.query.busqueda != undefined){
		busqueda = "%" + req.query.busqueda + "%"
	}
	else{
		busqueda = "%%"
	}
		if(req.query.usado != undefined){
		usado = req.query.usado
	}
	else{
		usado = "%%"
	}
	connection.query("select * from productos where nombre like ? and usado like ?", [busqueda, usado], function(error, results, fields){
			if(error) throw error;
			productos = results;
			
    		res.json( {productos} );
		});
} );

app.get( "/usuarios/:idUsuario/fav", ( req, res ) => {
	res.set({ 'Content-Type': 'application/json; charset=utf-8' });
	var productos = "Simastru";
	var idUsuario = req.params.idUsuario;
	console.log("Usuarios");
	console.log(idUsuario);
	connection.query("select * from productos inner join favoritos on productos.id = id_producto where id_usuario = ?", idUsuario, function(error, results, fields){
			if(error) throw error;
			productos = results;
			console.log(productos);
    		res.json( {productos} );
		});
} );

app.post( "/usuarios/:idUsuario/fav/:producto", ( req, res ) => {
	res.set({ 'Content-Type': 'application/json; charset=utf-8' });
	var idUsuario = req.params.idUsuario;
	var idProducto = req.params.producto;
	console.log("Usuarios");
	console.log(idUsuario);
	console.log(idProducto);
	connection.query("insert into favoritos( id_usuario, id_producto) values(?, ?)", [idUsuario, idProducto], function(error, results, fields){
			if(error) res.send("err"); throw error;
			console.log(fields);
		});
} );

app.delete( "/usuarios/:idUsuario/fav/:producto", ( req, res ) => {
	res.set({ 'Content-Type': 'application/json; charset=utf-8' });
	var productos = "Simastru";
	var idUsuario = req.params.idUsuario;
	var idProducto = req.params.producto;
	console.log("Usuarios");
	console.log(idUsuario);
	console.log(idProducto);
	connection.query("delete from favoritos where id_usuario = ? and id_producto = ?", [idUsuario, idProducto], function(error, results, fields){
			if(error) res.send("err"); throw error;
			console.log(fields);
		});
} );

app.get( "/usuarios/:idUsuario/compras", ( req, res ) => {
	res.set({ 'Content-Type': 'application/json; charset=utf-8' });
	var productos = "Simastru";
	var idUsuario = req.params.idUsuario;
	console.log("Usuarios");
	console.log(idUsuario);
	connection.query("select * from compras where id_usuario = ?", idUsuario, function(error, results, fields){
			if(error) res.send("err"); throw error;
			productos = results;
			console.log(productos);
    		res.json( {productos} );
		});
} );

app.post( "/usuarios/:idUsuario/compras/:idProducto/:cantidad", ( req, res ) => {
	var idUsuario = req.params.idUsuario;
	var idProducto = req.params.idProducto;
	var cantidad = req.params.cantidad;
	console.log("Usuarios");
	console.log(idUsuario);
	console.log(idProducto);
	console.log(cantidad);
	connection.query("insert into compras(id_usuario, id_producto, cantidad, fecha, comprador_calificado, vendedor_calificado) values(?, ?, ?, ?, 0, 0)", [idUsuario, idProducto, cantidad, dateTime], function(error, results, fields){
			if(error){
				res.send("err");
				throw error;
				
			} 
			res.send("exito");
		});
} );

app.get( "/usuarios/:idUsuario/calificaciones", ( req, res ) => {
	res.set({ 'Content-Type': 'application/json; charset=utf-8' });
	var idUsuario = req.params.idUsuario;
	console.log("Usuarios");
	console.log(idUsuario);
	connection.query("select * from calificaciones_compradores where id_comprador = ? or id_vendedor = ?", [idUsuario, idUsuario], function(error2, results2, fields2){
			if(error2) throw error2;
			var compras = results2;
			connection.query("select * from calificaciones_vendedores where id_vendedor = ? or id_comprador = ?", [idUsuario, idUsuario], function(error, results, fields){
				if(error) res.send("err"); throw error;
				var ventas = results;
    			res.json( {compras, ventas} );
			});
		});
} );

app.post( "/jawohl", ( req, res ) => {
	var resultado;
	let promesa = new Promise(function(myResolve, myReject) {
		connection.query("select 1+1", function(error, results, fields){
			if(error) myReject(error); 
				resultado = results;
				myResolve(resultado);
			});
			

		});

  		promesa.then(
  			function(value) { 
  				console.log("value");
  				resultado = value;
  			 },
  			function(error) { console.log(error) }
  			
  			
		);

		console.log(resultado);


	});




app.post( "/usuarios/:idUsuario/calificaciones/:idCompra/:calificacion", ( req, res ) => {
	var idUsuario = req.params.idUsuario;
	var idCompra = req.params.idCompra;
	var calificacion = parseInt(req.params.calificacion);
	console.log("Usuarios");
	console.log(idUsuario);
	console.log(idCompra);
	console.log(calificacion);	
	var id_comprador;
	var id_vendedor;
	var id_producto;






	let promesa = new Promise(function(myResolve, myReject) {
		connection.query("select id_usuario from compras where id = ?", idCompra, function(error, idComprador, fields){
			if(error) throw(error); 
				myResolve(idComprador);
			});
			

		});

  	promesa.then(
  		function(value) { 
  			id_comprador = value[0].id_usuario



  		let promesa2 = new Promise(function(myResolve, myReject) {
		connection.query("select id_producto from compras where id = ?", idCompra, function(error, idProducto, fields){
			if(error) throw(error); 
				myResolve(idProducto);
			});
			

		});

  	promesa2.then(
  		function(value) { 
  		let promesa3 = new Promise(function(myResolve, myReject) {
	  		id_producto = value[0].id_producto;
	  		  connection.query("select vendedor from productos where id = ?", id_producto, function(error, idVendedor, fields){
	  				if(error) throw(error); 
	  				myResolve(idVendedor);
	  			});

		});

		  	promesa3.then(

		  		function(value) { 
		  		console.log(value)
		  		id_vendedor = value[0].vendedor;
		  		console.log(id_vendedor)

			  		if(id_comprador == idUsuario){
					connection.query("insert into calificaciones_compradores(id_comprador, id_vendedor, calificacion, fecha) values(?, ?, ?, ?)", [id_comprador, id_vendedor, calificacion, dateTime], function(error4, valoresMisticos, fields4){if(error4) throw error4;});
					connection.query("update compras set comprador_calificado = 1 where id = ?", idCompra, function(error5, valoresMisticos2, fields5){if(error5) throw error5;});
					res.send("SEEEEEEEEEEEEEEE");
				}else if(id_vendedor == idUsuario){
					connection.query("insert into calificaciones_vendedores(id_comprador, id_vendedor, calificacion, fecha) values(?, ?, ?, ?)", [id_comprador, id_vendedor, calificacion, dateTime], function(error4, valoresMisticos, fields4){if(error4) throw error4;if(error4) throw error4;});
					connection.query("update compras set vendedor_calificado = 1 where id = ?", idCompra, function(error5, valoresMisticos2, fields5){if(error5) throw error5;});
					res.send("SEEEEEEEEEEEEEEE");
				}
				else{
					res.send("err");
				}




		  		},
		  		function(error) { console.log(error) }
		  	);
  		


  		},
  		function(error) { console.log(error) }
  			
  			
	);

  		},
  		function(error) { console.log(error) }


  			
	);

	



	

			

});

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );

