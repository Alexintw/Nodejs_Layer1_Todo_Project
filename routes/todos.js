const router = require('express').Router();
const { body, param, validationResult } = require('express-validator');
const ctrl = require('../controllers/todosController');

// 通用驗證 middleware
const validate = validations => async (req, res, next) => {
  await Promise.all(validations.map(v => v.run(req)));
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  res.status(400).json({ errors: errors.array() });
};

router.get('/', ctrl.list);

router.post(
  '/',
  validate([
    body('text')
      .exists().withMessage('Text 欄位為必填')
      .isString().withMessage('Text 必須是字串')
      .notEmpty().withMessage('Text 不可為空'),
  ]),
  ctrl.create
);

router.get(
  '/:id',
  validate([
    param('id').isMongoId().withMessage('Invalid Todo ID'),
  ]),
  ctrl.getById
);

router.put(
  '/:id',
  validate([
    param('id').isMongoId().withMessage('Invalid Todo ID'),
    body('text').optional().isString().withMessage('Text 必須是字串'),
    body('done').optional().isBoolean().withMessage('Done 必須是布林值'),
  ]),
  ctrl.update
);

router.delete(
  '/:id',
  validate([
    param('id').isMongoId().withMessage('Invalid Todo ID'),
  ]),
  ctrl.remove
);

module.exports = router;