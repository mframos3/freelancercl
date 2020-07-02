# Documentación de Api de FreeLancer

La API de The FreeLancer es organizada en forma REST. Nuestra API esta en base de URL, 
acepta _**form-encoded**_ _**request**_ _**bodies**_ y retorna un JSON.

## Publicaciones

Puedes usar esta API para ver las distintas publicaciones que se encuentran en nuestra aplicación, 
ya sea de oferta o de busqueda. Esta API funciona al pedir a la base de datos por medio de un url, 
al que responderá con un JSON y luego descomprimirá la información. Todo esto por medio de React.
Además podrás filtrar las publicaciones por sus categorías.

### Publicaciones de Oferta

El pedido a la base de datos debe ser:  
`GET /api/posts/offeringPosts`  
lo que mandará como respuesta un json con una lista con todas las publicaciones disponibles. Cada 
publicación vendrá con su informcación correspondiente, esto incluye: su id, el título de la publicación
su imágen en caso de tener, la categoría, su descripción, el id del creador del post, su precio y su
rating.
```
[
  offeringPost {  
    dataValues: {  
      id: 1,  
      name: 'Ofrecemos trabajo de Facilitador',  
      img: null,  
      category: 'General',  
      description: 'Cupiditate assumenda saepe. Nobis quia nostrum.',  
      userId: 10,  
      price: 265541,  
      rating: 0,
      endsAt: 2021-02-03T21:11:35.985Z,
      createdAt: 2020-06-30T04:11:33.676Z,
      updatedAt: 2020-06-30T04:11:33.676Z
    },
    _previousDataValues: {
      id: 1,
      name: 'Ofrecemos trabajo de Facilitador',
      img: null,
      category: 'General',
      description: 'Cupiditate assumenda saepe. Nobis quia nostrum.',
      userId: 10,
      price: 265541,
      rating: 0,
      endsAt: 2021-02-03T21:11:35.985Z,
      createdAt: 2020-06-30T04:11:33.676Z,
      updatedAt: 2020-06-30T04:11:33.676Z
    },
    _changed: {},
    _modelOptions: {
      timestamps: true,
      validate: {},
      freezeTableName: false,
      underscored: false,
      paranoid: false,
      rejectOnEmpty: false,
      whereCollection: [Object],
      schema: null,
      schemaDelimiter: '',
      defaultScope: {},
      scopes: {},
      indexes: [],
      name: [Object],
      omitNull: false,
      sequelize: [Sequelize],
      hooks: {}
    },
    _options: {
      isNewRecord: false,
      _schema: null,
      _schemaDelimiter: '',
      raw: true,
      attributes: [Array]
    },
    isNewRecord: false
  }
]
```
