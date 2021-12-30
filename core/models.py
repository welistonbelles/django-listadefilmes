from django.db import models

# Create your models here.
from stdimage.models import StdImageField

#SIGNALS
from django.db.models import signals
from django.template.defaultfilters import slugify

class Base(models.Model):
    criado = models.DateField('Data de Criação', auto_now_add=True)
    modificado = models.DateField('Data de Atualização', auto_now=True)
    ativo = models.BooleanField('Ativo?', default=True)

    class Meta:
        abstract = True

class Movie(Base):
    name = models.CharField('Nome', max_length=100)
    date = models.DateField('Data de lançamento:')
    description = models.CharField('Descrição', max_length=300)
    slug = models.SlugField('Slug', max_length=100, blank=True, editable=False)
    def __str__(self):
        return self.name

def movie_pre_save(signal, instance, sender, **kwargs):
    instance.slug = slugify(instance.name)

signals.pre_save.connect(movie_pre_save, sender=Movie)